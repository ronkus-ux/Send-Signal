'use server';

import { prisma } from '../prisma';
import { getSession } from '../auth/session';
import { decryptText } from '../auth/crypto';
import { getConversations, getConversationMessages } from './conversation';
import { getDashboardAnalytics, getRecentCampaignsAnalytics } from './analytics';

export async function fetchOverviewData() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');
  const userId = session.user.id;

  const [totalCampaigns, totalLeads, savedTemplates] = await Promise.all([
    prisma.campaign.count({
      where: { user_id: userId, deleted_at: null },
    }),
    prisma.lead.count({
      where: { user_id: userId, deleted_at: null },
    }),
    prisma.template.count({
      where: { user_id: userId, deleted_at: null },
    }),
  ]);

  return { totalCampaigns, totalLeads, savedTemplates };
}

export async function fetchLeadsData() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const leads = await prisma.lead.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: 'desc' }
  });

  return leads;
}

export async function fetchTemplatesData() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const templates = await prisma.template.findMany({
    where: {
      user_id: session.user.id,
      is_archived: false,
      deleted_at: null,
    },
    orderBy: { created_at: 'desc' },
  });

  return templates;
}

export async function fetchCampaignsData() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');
  const userId = session.user.id;

  const [campaigns, whatsappAccounts, templates, leads] = await Promise.all([
    prisma.campaign.findMany({
      where: { user_id: userId, deleted_at: null },
      include: { template: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    }),
    prisma.whatsappAccount.findMany({
      where: { user_id: userId, is_active: true },
    }),
    prisma.template.findMany({
      where: { user_id: userId, is_archived: false, deleted_at: null },
      select: { id: true, name: true, body: true },
      orderBy: { name: 'asc' },
    }),
    prisma.lead.findMany({
      where: { user_id: userId, opt_in: true, unsubscribed: false, deleted_at: null },
      select: { id: true, first_name: true, last_name: true, phone_number: true },
      orderBy: { created_at: 'desc' },
    }),
  ]);

  return { campaigns, whatsappAccounts, templates, leads };
}

export async function fetchConversationsData() {
  const conversations = await getConversations();

  const initialMessages: Record<string, any[]> = {};
  await Promise.all(
    conversations.map(async (conv) => {
      const msgs = await getConversationMessages(conv.id);
      initialMessages[conv.id] = msgs;
    })
  );

  return { conversations, initialMessages };
}

export async function fetchAnalyticsData() {
  const [metrics, recentCampaigns] = await Promise.all([
    getDashboardAnalytics(),
    getRecentCampaignsAnalytics(),
  ]);

  return { metrics, recentCampaigns };
}

export async function fetchSettingsData() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const accounts = await prisma.whatsappAccount.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: 'desc' }
  });

  const decryptedAccounts = accounts.map((account) => {
    let webhook_verify_token = '';
    if (account.webhook_verify_token_encrypted) {
      try {
        webhook_verify_token = decryptText(account.webhook_verify_token_encrypted);
      } catch (err) {
        console.error('Failed to decrypt webhook verify token:', err);
      }
    }
    return {
      id: account.id,
      account_name: account.account_name,
      display_phone_number: account.display_phone_number,
      phone_number_id: account.phone_number_id,
      is_active: account.is_active,
      webhook_verify_token,
    };
  });

  return {
    company_name: session.user.company_name,
    email: session.user.email,
    accounts: decryptedAccounts
  };
}

export async function updateProfileSettings(formData: { company_name: string; email: string }) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');
  const userId = session.user.id;

  if (!formData.company_name.trim()) {
    return { success: false, error: 'Company Name cannot be empty' };
  }
  if (!formData.email.trim()) {
    return { success: false, error: 'Email Address cannot be empty' };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: formData.email,
        id: { not: userId }
      }
    });

    if (existingUser) {
      return { success: false, error: 'Email is already in use by another account' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        company_name: formData.company_name,
        email: formData.email
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error('Failed to update profile settings:', err);
    return { success: false, error: err.message || 'Failed to update profile settings' };
  }
}
