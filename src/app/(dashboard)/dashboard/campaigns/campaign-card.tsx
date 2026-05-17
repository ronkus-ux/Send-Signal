'use client';

import { useTransition } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { startCampaign, deleteCampaign } from '@/lib/actions/campaign';

type Campaign = {
  id: string;
  name: string;
  status: string;
  description?: string | null;
  total_recipients?: number | null;
  total_queued?: number | null;
  total_sent?: number | null;
  total_replied?: number | null;
  created_at: string | Date;
  template?: { name: string } | null;
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  SCHEDULED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  RUNNING: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  PAUSED: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  COMPLETED: 'bg-green-50 text-green-700 ring-green-600/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/10',
  FAILED: 'bg-red-50 text-red-700 ring-red-600/10',
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] truncate">{campaign.name}</h3>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[campaign.status] ?? STATUS_STYLES.DRAFT}`}>
              {campaign.status}
            </span>
          </div>
          {campaign.description && (
            <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1 truncate">{campaign.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {campaign.status === 'DRAFT' && (
            <>
              <button
                onClick={() => startTransition(() => startCampaign(campaign.id))}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                title="Start Campaign"
              >
                <Play className="w-3 h-3" />
                Start
              </button>
              <button
                onClick={() => { if (confirm(`Delete campaign "${campaign.name}"?`)) startTransition(() => deleteCampaign(campaign.id)); }}
                disabled={isPending}
                className="p-1.5 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Delete Campaign"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] grid grid-cols-4 gap-3 text-xs">
        {[
          { label: 'Recipients', value: campaign.total_recipients },
          { label: 'Queued', value: campaign.total_queued },
          { label: 'Sent', value: campaign.total_sent },
          { label: 'Replied', value: campaign.total_replied },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">{value ?? 0}</p>
            <p className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 py-2.5 border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex items-center justify-between text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">
        <span>Template: <span className="font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">{campaign.template?.name ?? '—'}</span></span>
        <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
