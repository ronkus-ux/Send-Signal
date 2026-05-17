'use server';

import { prisma } from '../prisma';
import { getSession } from '../auth/session';

export async function getDashboardAnalytics() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const campaigns = await prisma.campaign.findMany({
    where: { user_id: session.user.id, deleted_at: null },
    select: {
      status: true,
      total_sent: true,
      total_delivered: true,
      total_replied: true,
      total_converted: true,
    },
  });

  const totalCampaigns = campaigns.length;
  
  let totalSent = 0;
  let totalDelivered = 0;
  let totalReplied = 0;
  let totalConverted = 0;

  campaigns.forEach(c => {
    totalSent += c.total_sent;
    totalDelivered += c.total_delivered;
    totalReplied += c.total_replied;
    totalConverted += c.total_converted;
  });

  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
  const replyRate = totalDelivered > 0 ? Math.round((totalReplied / totalDelivered) * 100) : 0;

  return {
    totalCampaigns,
    totalSent,
    totalDelivered,
    totalReplied,
    totalConverted,
    deliveryRate,
    replyRate,
  };
}

export async function getRecentCampaignsAnalytics() {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const recentCampaigns = await prisma.campaign.findMany({
    where: { user_id: session.user.id, deleted_at: null },
    orderBy: { created_at: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      status: true,
      created_at: true,
      total_recipients: true,
      total_sent: true,
      total_delivered: true,
      total_read: true,
      total_replied: true,
    },
  });

  return recentCampaigns;
}
