'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { getSession } from '../auth/session';
import { sendTextMessage } from '../whatsapp/client';
import { decryptText } from '../auth/crypto';

export async function getConversations() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const conversations = await prisma.conversation.findMany({
    where: { user_id: session.user.id },
    include: { lead: true, whatsapp_account: true },
    orderBy: { last_message_at: 'desc' },
  });

  return conversations;
}

export async function getConversationMessages(conversationId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const messages = await prisma.conversationMessage.findMany({
    where: { 
      conversation_id: conversationId,
      conversation: { user_id: session.user.id } 
    },
    orderBy: { created_at: 'asc' },
  });

  return messages;
}

export async function sendManualReply(conversationId: string, text: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  if (!text.trim()) return { success: false, error: 'Message cannot be empty' };

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId, user_id: session.user.id },
    include: { lead: true, whatsapp_account: true },
  });

  if (!conversation) return { success: false, error: 'Conversation not found' };

  let accessToken: string;
  try {
    accessToken = decryptText(conversation.whatsapp_account.access_token_encrypted);
  } catch {
    return { success: false, error: 'Failed to decrypt credentials' };
  }

  // Dispatch via WhatsApp API
  const result = await sendTextMessage(
    conversation.whatsapp_account.phone_number_id,
    accessToken,
    conversation.lead.phone_number,
    text
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Create message record
  const now = new Date();
  await prisma.$transaction([
    prisma.conversationMessage.create({
      data: {
        conversation_id: conversation.id,
        lead_id: conversation.lead_id,
        direction: 'OUTBOUND',
        body: text,
        whatsapp_message_id: result.messageId,
        sent_at: now,
      },
    }),
    prisma.conversation.update({
      where: { id: conversation.id },
      data: { last_message_at: now },
    })
  ]);

  revalidatePath('/dashboard/conversations');
  return { success: true };
}
