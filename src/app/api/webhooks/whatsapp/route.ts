import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptText } from '@/lib/auth/crypto';
import { createHmac, timingSafeEqual } from 'crypto';

const UNSUBSCRIBE_KEYWORDS = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];

/**
 * GET — Meta webhook verification challenge
 * Meta sends: hub.mode, hub.verify_token, hub.challenge
 * We compare hub.verify_token against all connected WhatsApp accounts' stored verify tokens.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode !== 'subscribe' || !token) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Look through all WhatsApp accounts to find a matching verify token
  const accounts = await prisma.whatsappAccount.findMany({
    select: { id: true, webhook_verify_token_encrypted: true },
  });

  const matched = accounts.some((account: { id: string; webhook_verify_token_encrypted: string }) => {
    try {
      const decrypted = decryptText(account.webhook_verify_token_encrypted);
      return decrypted === token;
    } catch {
      return false;
    }
  });

  if (matched) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

/**
 * POST — Incoming webhook events from Meta
 * Handles:
 *   - Message status updates: sent, delivered, read, failed
 *   - Inbound messages: replies, unsubscribe keywords
 */
export async function POST(req: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  let body: Record<string, unknown>;

  if (appSecret) {
    const signatureHeader = req.headers.get('x-hub-signature-256');
    if (!signatureHeader) {
      console.warn('Webhook warning: Missing x-hub-signature-256 header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const rawBody = await req.text();
    const signature = signatureHeader.startsWith('sha256=')
      ? signatureHeader.slice(7)
      : signatureHeader;

    const hmac = createHmac('sha256', appSecret);
    const digest = hmac.update(rawBody).digest('hex');

    try {
      const expectedBuffer = Buffer.from(signature, 'hex');
      const actualBuffer = Buffer.from(digest, 'hex');

      if (
        expectedBuffer.length !== actualBuffer.length ||
        !timingSafeEqual(expectedBuffer, actualBuffer)
      ) {
        console.warn('Webhook warning: Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch (err) {
      console.error('Webhook error during signature verification:', err);
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  if (body?.object !== 'whatsapp_business_account') {
    return NextResponse.json({ status: 'ignored' });
  }

  const entries = (body?.entry as Record<string, unknown>[]) ?? [];

  for (const entry of entries) {
    const changes = ((entry as Record<string, unknown>)?.changes as Record<string, unknown>[]) ?? [];
    for (const change of changes) {
      if (change?.field !== 'messages') continue;

      const value = change?.value as Record<string, any>;
      const phoneNumberId: string = value?.metadata?.phone_number_id;

      if (!phoneNumberId) continue;

      // Find the WhatsApp account for this phone number ID
      const account = await prisma.whatsappAccount.findUnique({
        where: { phone_number_id: phoneNumberId },
        select: { id: true, user_id: true },
      });

      if (!account) continue;

      // Handle message status updates
      const statuses: Record<string, unknown>[] = (value as Record<string, unknown>)?.statuses as Record<string, unknown>[] ?? [];
      for (const status of statuses) {
        await handleStatusUpdate(status);
      }

      // Handle inbound messages (replies, unsubscribes)
      const messages: Record<string, unknown>[] = (value as Record<string, unknown>)?.messages as Record<string, unknown>[] ?? [];
      for (const message of messages) {
        await handleInboundMessage(message, account.id, account.user_id);
      }
    }
  }

  // Always respond 200 to Meta to acknowledge receipt
  return NextResponse.json({ status: 'ok' });
}

async function handleStatusUpdate(status: Record<string, unknown>) {
  const whatsappMsgId: string = status?.id as string;
  const rawStatus: string = status?.status as string;
  const timestamp: string = status?.timestamp as string;

  if (!whatsappMsgId || !rawStatus) return;

  const eventTime = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date();

  const updateData: Record<string, any> = {};

  switch (rawStatus.toLowerCase()) {
    case 'sent':
      updateData.status = 'SENT';
      updateData.sent_at = eventTime;
      break;
    case 'delivered':
      updateData.status = 'DELIVERED';
      updateData.delivered_at = eventTime;
      break;
    case 'read':
      updateData.status = 'READ';
      updateData.read_at = eventTime;
      break;
    case 'failed':
      updateData.status = 'FAILED';
      updateData.failure_reason = (status?.errors as Record<string, unknown>[] | undefined)?.[0]?.message ?? 'Unknown failure';
      break;
    default:
      return;
  }

  // Fetch message to get user_id, lead_id, and campaign_id
  const msg = await prisma.message.findUnique({
    where: { whatsapp_message_id: whatsappMsgId },
    select: { user_id: true, lead_id: true, campaign_id: true, id: true, status: true }
  });

  if (!msg) return;

  // Update the message
  await prisma.message.update({
    where: { id: msg.id },
    data: updateData,
  });

  // Increment campaign counters on transition
  if (msg.campaign_id) {
    const prevStatus = msg.status;
    const newStatus = updateData.status;

    if (newStatus === 'SENT' && prevStatus === 'QUEUED') {
      await prisma.campaign.update({
        where: { id: msg.campaign_id },
        data: { total_sent: { increment: 1 } }
      });
    } else if (newStatus === 'DELIVERED' && prevStatus !== 'DELIVERED' && prevStatus !== 'READ' && prevStatus !== 'REPLIED') {
      await prisma.campaign.update({
        where: { id: msg.campaign_id },
        data: { total_delivered: { increment: 1 } }
      });
    } else if (newStatus === 'READ' && prevStatus !== 'READ' && prevStatus !== 'REPLIED') {
      const incrementData: Record<string, any> = { total_read: { increment: 1 } };
      if (prevStatus !== 'DELIVERED') {
        incrementData.total_delivered = { increment: 1 };
      }
      await prisma.campaign.update({
        where: { id: msg.campaign_id },
        data: incrementData
      });
    } else if (newStatus === 'FAILED' && prevStatus !== 'FAILED') {
      await prisma.campaign.update({
        where: { id: msg.campaign_id },
        data: { total_failed: { increment: 1 } }
      });
    }
  }

  let eventType: 'MESSAGE_SENT' | 'MESSAGE_DELIVERED' | 'MESSAGE_READ' | 'MESSAGE_FAILED' | undefined;
  if (updateData.status === 'SENT') eventType = 'MESSAGE_SENT';
  if (updateData.status === 'DELIVERED') eventType = 'MESSAGE_DELIVERED';
  if (updateData.status === 'READ') eventType = 'MESSAGE_READ';
  if (updateData.status === 'FAILED') eventType = 'MESSAGE_FAILED';
  
  if (eventType) {
    await prisma.activityLog.create({
      data: {
        user_id: msg.user_id,
        lead_id: msg.lead_id,
        campaign_id: msg.campaign_id,
        message_id: msg.id,
        event_type: eventType,
        description: `Message status updated to ${updateData.status}`,
        created_at: eventTime,
      }
    });
  }
}

async function handleInboundMessage(
  message: Record<string, unknown>,
  whatsappAccountId: string,
  userId: string
) {
  const fromPhone: string = message?.from as string;
  const msgType: string = message?.type as string;
  const whatsappMsgId: string = message?.id as string;
  const timestamp: string = message?.timestamp as string;

  if (!fromPhone) return;

  const receivedAt = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date();

  // Find matching lead by phone number
  const lead = await prisma.lead.findFirst({
    where: { phone_number: fromPhone, user_id: userId },
    select: { id: true, phone_number: true },
  });

  if (!lead) return;

  let messageBody = '';
  if (msgType === 'text') {
    messageBody = ((message?.text as Record<string, unknown>)?.body as string) ?? '';
  }

  // --- Unsubscribe detection ---
  const upperBody = messageBody.trim().toUpperCase();
  if (UNSUBSCRIBE_KEYWORDS.includes(upperBody)) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        unsubscribed: true,
        unsubscribed_at: receivedAt,
        status: 'UNSUBSCRIBED',
      },
    });

    // Also mark any related outbound message as UNSUBSCRIBED
    const unsubOutbound = await prisma.message.findMany({
      where: { lead_id: lead.id, status: { in: ['SENT', 'DELIVERED', 'READ'] } },
      select: { id: true, campaign_id: true },
    });

    if (unsubOutbound.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unsubOutbound.map(m => m.id) } },
        data: { status: 'UNSUBSCRIBED' },
      });

      for (const msg of unsubOutbound) {
        if (msg.campaign_id) {
          await prisma.campaign.update({
            where: { id: msg.campaign_id },
            data: { total_unsubscribed: { increment: 1 } },
          });
        }
      }
    }

    await prisma.activityLog.create({
      data: {
        user_id: userId,
        lead_id: lead.id,
        event_type: 'LEAD_UNSUBSCRIBED',
        description: 'Lead opted out via keyword',
        created_at: receivedAt,
      }
    });
  } else {
    // Find outbound messages that are about to be marked as REPLIED
    const outboundMessages = await prisma.message.findMany({
      where: {
        lead_id: lead.id,
        whatsapp_account_id: whatsappAccountId,
        status: { in: ['SENT', 'DELIVERED', 'READ'] },
        direction: 'OUTBOUND',
      },
      select: { id: true, campaign_id: true, status: true },
    });

    if (outboundMessages.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: outboundMessages.map(m => m.id) } },
        data: { status: 'REPLIED', replied_at: receivedAt },
      });

      for (const msg of outboundMessages) {
        if (msg.campaign_id) {
          await prisma.campaign.update({
            where: { id: msg.campaign_id },
            data: { total_replied: { increment: 1 } },
          });
        }
      }
    }

    // Update lead status to REPLIED
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'REPLIED' },
    });

    await prisma.activityLog.create({
      data: {
        user_id: userId,
        lead_id: lead.id,
        event_type: 'REPLY_RECEIVED',
        description: 'Received an inbound message',
        created_at: receivedAt,
      }
    });
  }

  // Find or create conversation thread
  const conversation = await prisma.conversation.upsert({
    where: {
      user_id_lead_id_whatsapp_account_id: {
        user_id: userId,
        lead_id: lead.id,
        whatsapp_account_id: whatsappAccountId,
      },
    },
    update: { last_message_at: receivedAt },
    create: {
      user_id: userId,
      lead_id: lead.id,
      whatsapp_account_id: whatsappAccountId,
      source: 'WEBHOOK',
      last_message_at: receivedAt,
    },
  });

  // Record the inbound ConversationMessage
  if (messageBody) {
    await prisma.conversationMessage.create({
      data: {
        conversation_id: conversation.id,
        lead_id: lead.id,
        direction: 'INBOUND',
        body: messageBody,
        whatsapp_message_id: whatsappMsgId,
        received_at: receivedAt,
      },
    });
  }
}
