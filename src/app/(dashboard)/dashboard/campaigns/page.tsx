import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { CreateCampaignWizard } from './create-campaign-wizard';
import { CampaignCard } from './campaign-card';

export default async function CampaignsPage() {
  const session = await getSession();
  const userId = session!.user.id;

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
    // Only eligible leads for selection
    prisma.lead.findMany({
      where: { user_id: userId, opt_in: true, unsubscribed: false, deleted_at: null },
      select: { id: true, first_name: true, last_name: true, phone_number: true },
      orderBy: { created_at: 'desc' },
    }),
  ]);

  const statusCounts = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === 'DRAFT').length,
    running: campaigns.filter(c => c.status === 'RUNNING').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED').length,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight">Campaigns</h1>
          <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Create and manage your outreach campaigns.</p>
        </div>
        <CreateCampaignWizard
          whatsappAccounts={whatsappAccounts}
          templates={templates}
          leads={leads}
          hasNoWhatsappAccount={whatsappAccounts.length === 0}
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: statusCounts.total, color: 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]' },
          { label: 'Draft', value: statusCounts.draft, color: 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]' },
          { label: 'Running', value: statusCounts.running, color: 'text-yellow-600' },
          { label: 'Completed', value: statusCounts.completed, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
            <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">{label}</p>
            <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] p-12 text-center">
          <h3 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">No campaigns yet</h3>
          <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Create your first campaign to start sending messages.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              hasNoWhatsappAccount={whatsappAccounts.length === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
