'use server';

import { prisma } from '../prisma';
import { getSession } from '../auth/session';

export async function getLeadActivity(leadId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  const logs = await prisma.activityLog.findMany({
    where: { lead_id: leadId, user_id: session.user.id },
    orderBy: { created_at: 'desc' },
    include: {
      campaign: { select: { name: true } },
    }
  });

  return logs;
}
