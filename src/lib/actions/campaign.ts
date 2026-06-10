'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { getSession } from '../auth/session';
import { CreateCampaignSchema, CreateCampaignFormState } from '../validations/campaign';
import { renderTemplate } from '../validations/template';
import { sendTextMessage, sleep } from '../whatsapp/client';
import { decryptText } from '../auth/crypto';

export async function createCampaign(
  state: CreateCampaignFormState,
  formData: FormData
): Promise<CreateCampaignFormState> {
  const session = await getSession();
  if (!session?.user) return { message: 'Unauthorized' };

  const rawLeadIds = formData.getAll('lead_ids') as string[];

  const validated = CreateCampaignSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    whatsapp_account_id: formData.get('whatsapp_account_id'),
    template_id: formData.get('template_id'),
    lead_ids: rawLeadIds,
    scheduled_at: formData.get('scheduled_at') || null,
    batch_size: formData.get('batch_size') || 50,
    delay_in_seconds: formData.get('delay_in_seconds') || 5,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  // Compliance: only fetch opted-in, non-unsubscribed leads
  const eligibleLeads = await prisma.lead.findMany({
    where: {
      id: { in: data.lead_ids },
      user_id: session.user.id,
      opt_in: true,
      unsubscribed: false,
      deleted_at: null,
    },
    select: { id: true },
  });

  if (eligibleLeads.length === 0) {
    return { message: 'No eligible leads found. Ensure selected leads have opted in and are not unsubscribed.' };
  }

  try {
    const campaign = await prisma.campaign.create({
      data: {
        user_id: session.user.id,
        whatsapp_account_id: data.whatsapp_account_id,
        template_id: data.template_id,
        name: data.name,
        description: data.description,
        status: 'DRAFT',
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
        batch_size: data.batch_size,
        delay_in_seconds: data.delay_in_seconds,
        total_recipients: eligibleLeads.length,
      },
    });

    // Idempotent: skipDuplicates prevents re-queuing same lead
    await prisma.campaignLead.createMany({
      data: eligibleLeads.map(lead => ({
        campaign_id: campaign.id,
        lead_id: lead.id,
        status: 'QUEUED',
      })),
      skipDuplicates: true,
    });

    revalidatePath('/dashboard/campaigns');
    return { message: 'SUCCESS', campaignId: campaign.id };
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return { message: 'An internal error occurred. Please try again.' };
  }
}

export async function startCampaign(campaignId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  // Backend guard: check if user has at least one active WhatsApp account
  const whatsappAccountCount = await prisma.whatsappAccount.count({
    where: { user_id: session.user.id, is_active: true }
  });
  if (whatsappAccountCount === 0) {
    throw new Error('No active WhatsApp account connected. Please connect a WhatsApp account first.');
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, user_id: session.user.id, status: 'DRAFT' },
    include: {
      template: true,
      campaign_leads: {
        where: { status: 'QUEUED' },
        include: { lead: true },
      },
    },
  });

  if (!campaign) throw new Error('Campaign not found or already started');

  // Transition to RUNNING
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'RUNNING', started_at: new Date(), total_queued: campaign.campaign_leads.length },
  });

  await prisma.activityLog.create({
    data: {
      user_id: session.user.id,
      campaign_id: campaignId,
      event_type: 'CAMPAIGN_STARTED',
      description: `Campaign started with ${campaign.campaign_leads.length} leads queued`,
      created_at: new Date(),
    }
  });

  // Render and queue a Message row per lead (idempotent)
  const messageData = campaign.campaign_leads.map(cl => {
    const lead = cl.lead;
    const rendered = renderTemplate(campaign.template.body, {
      first_name: lead.first_name ?? '',
      last_name: lead.last_name ?? '',
      full_name: [lead.first_name, lead.last_name].filter(Boolean).join(' '),
      phone_number: lead.phone_number,
      email: lead.email ?? '',
    });

    return {
      user_id: session!.user.id,
      whatsapp_account_id: campaign.whatsapp_account_id,
      campaign_id: campaignId,
      campaign_lead_id: cl.id,
      lead_id: lead.id,
      direction: 'OUTBOUND' as const,
      status: 'QUEUED' as const,
      template_snapshot: { name: campaign.template.name, body: campaign.template.body },
      rendered_body: rendered,
      queued_at: new Date(),
    };
  });

  if (messageData.length > 0) {
    await prisma.message.createMany({ data: messageData, skipDuplicates: true });
  }

  // Dispatch via WhatsApp API
  await dispatchCampaignMessages(campaignId);

  revalidatePath('/dashboard/campaigns');
}

async function dispatchCampaignMessages(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { whatsapp_account: true },
  });

  if (!campaign) return;

  const batchSize = campaign.batch_size ?? 50;
  const delayMs = (campaign.delay_in_seconds ?? 5) * 1000;

  // Decrypt access token once
  let accessToken: string;
  try {
    accessToken = decryptText(campaign.whatsapp_account.access_token_encrypted);
  } catch {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'FAILED' },
    });
    return;
  }

  const phoneNumberId = campaign.whatsapp_account.phone_number_id;

  // Fetch all QUEUED messages for this campaign
  const messages = await prisma.message.findMany({
    where: { campaign_id: campaignId, status: 'QUEUED' },
    include: { lead: { select: { phone_number: true } } },
  });

  let totalSent = 0;
  let totalFailed = 0;

  // Process in batches
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async msg => {
        const result = await sendTextMessage(
          phoneNumberId,
          accessToken,
          msg.lead.phone_number,
          msg.rendered_body ?? ''
        );

        if (result.success) {
          await prisma.message.update({
            where: { id: msg.id },
            data: {
              status: 'SENT',
              whatsapp_message_id: result.messageId,
              sent_at: new Date(),
              sending_at: new Date(),
            },
          });
          
          await prisma.activityLog.create({
            data: {
              user_id: campaign.user_id,
              lead_id: msg.lead_id,
              campaign_id: campaignId,
              message_id: msg.id,
              event_type: 'MESSAGE_SENT',
              description: 'Message successfully dispatched',
            }
          });
          totalSent++;
        } else {
          await prisma.message.update({
            where: { id: msg.id },
            data: {
              status: 'FAILED',
              failure_reason: result.error,
            },
          });
          
          await prisma.activityLog.create({
            data: {
              user_id: campaign.user_id,
              lead_id: msg.lead_id,
              campaign_id: campaignId,
              message_id: msg.id,
              event_type: 'MESSAGE_FAILED',
              description: `Dispatch failed: ${result.error}`,
            }
          });
          totalFailed++;
        }
      })
    );

    // Rate-limit delay between batches (skip after last batch)
    if (i + batchSize < messages.length) {
      await sleep(delayMs);
    }
  }

  // Mark campaign completed and update counters
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: 'COMPLETED',
      completed_at: new Date(),
      total_sent: totalSent,
      total_failed: totalFailed,
    },
  });
}

export async function deleteCampaign(campaignId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  await prisma.campaign.updateMany({
    where: { id: campaignId, user_id: session.user.id, status: 'DRAFT' },
    data: { deleted_at: new Date() },
  });

  revalidatePath('/dashboard/campaigns');
}
