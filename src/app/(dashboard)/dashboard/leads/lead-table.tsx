'use client';

import { useState, useTransition, useEffect } from 'react';
import { Trash2, X, Activity, Users } from 'lucide-react';
import { deleteLead } from '@/lib/actions/lead';
import { getLeadActivity } from '@/lib/actions/activity';
import { CsvImporter } from './csv-importer';

type Lead = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number: string;
  email?: string | null;
  status: string;
  opt_in: boolean;
};

type ActivityLog = {
  id: string;
  description: string | null;
  created_at: string | Date;
  campaign?: { name: string } | null;
};

export function LeadTable({ leads, onImportSuccess }: { leads: Lead[]; onImportSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    if (selectedLead) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingActivity(true);
      getLeadActivity(selectedLead.id as string).then(logs => {
        setActivities(logs);
        setIsLoadingActivity(false);
      });
    } else {
      setActivities([]);
    }
  }, [selectedLead]);

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] py-20 px-6 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] flex items-center justify-center text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-5">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] font-semibold">
          No leads found
        </h3>
        <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-2 max-w-md">
          You haven&apos;t added any leads yet. Import a CSV to get started with your campaigns.
        </p>
        <button
          onClick={() => setIsImportOpen(true)}
          className="mt-6 px-6 py-2.5 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-md label-large shadow-sm cursor-pointer border-none font-medium transition-colors"
        >
          Import Leads
        </button>
        <CsvImporter isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onSuccess={onImportSuccess} />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      NEW: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      CONTACTED: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
      CONVERTED: 'bg-green-50 text-green-700 ring-green-600/20',
      UNSUBSCRIBED: 'bg-red-50 text-red-700 ring-red-600/10',
    };
    const style = styles[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
              <tr>
                <th className="px-6 py-4 font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">Name</th>
                <th className="px-6 py-4 font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">Phone Number</th>
                <th className="px-6 py-4 font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">Email</th>
                <th className="px-6 py-4 font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">Status</th>
                <th className="px-6 py-4 font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">Opt-In</th>
                <th className="px-6 py-4 font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-6 py-4 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] font-medium">
                    {lead.first_name || lead.last_name ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim() : '-'}
                  </td>
                  <td className="px-6 py-4 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">
                    {lead.phone_number}
                  </td>
                  <td className="px-6 py-4 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">
                    {lead.email || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status as string)}
                  </td>
                  <td className="px-6 py-4">
                    {lead.opt_in ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this lead?')) {
                          startTransition(() => {
                            deleteLead(lead.id as string);
                          });
                        }
                      }}
                      disabled={isPending}
                      className="p-1.5 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-error-error60)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-error-error95)] rounded-md transition-colors disabled:opacity-50 inline-flex items-center"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/20" onClick={() => setSelectedLead(null)}>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedLead.first_name || selectedLead.last_name ? `${selectedLead.first_name || ''} ${selectedLead.last_name || ''}`.trim() : selectedLead.phone_number}
                </h2>
                <p className="text-sm text-gray-500">{selectedLead.phone_number}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={16} /> Activity Timeline
              </h3>
              
              {isLoadingActivity ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                  </div>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  No activity recorded for this lead yet.
                </div>
              ) : (
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 ? (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-8 ring-gray-50">
                                <Activity className="h-4 w-4 text-blue-600" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {activity.description}{' '}
                                  {activity.campaign && <span className="font-medium text-gray-900">in {activity.campaign.name}</span>}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-xs text-gray-500">
                                {new Date(activity.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
