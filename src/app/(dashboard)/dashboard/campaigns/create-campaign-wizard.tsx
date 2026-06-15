'use client';

import { useState, useActionState } from 'react';
import { createCampaign } from '@/lib/actions/campaign';
import { renderTemplate } from '@/lib/validations/template';
import { Plus, ChevronRight, ChevronLeft, X } from 'lucide-react';

type Step = 1 | 2 | 3;

type Lead = { id: string; phone_number: string; first_name?: string | null; last_name?: string | null };
type Template = { id: string; name: string; body: string };
type WhatsappAccount = { id: string; account_name: string; display_phone_number: string };

type Props = {
  whatsappAccounts: WhatsappAccount[];
  templates: Template[];
  leads: Lead[];
  hasNoWhatsappAccount?: boolean;
};

const SAMPLE_LEAD = { first_name: 'Alex', last_name: 'Johnson', full_name: 'Alex Johnson', phone_number: '+1234567890', email: 'alex@example.com' };

export function CreateCampaignWizard({ 
  whatsappAccounts, 
  templates, 
  leads, 
  hasNoWhatsappAccount = false, 
  onSuccess,
  isOpen: propIsOpen,
  onClose: propOnClose
}: Props & { 
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const [step, setStep] = useState<Step>(1);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const [state, formAction, isPending] = useActionState(createCampaign, {});

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const filteredLeads = leads.filter(l =>
    !search ||
    l.phone_number.includes(search) ||
    `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLead = (id: string) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const reset = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setStep(1);
    setSelectedAccountId('');
    setSelectedTemplateId('');
    setSelectedLeadIds(new Set());
    setSearch('');
  };

  if (state?.message === 'SUCCESS' && isOpen) {
    reset();
    onSuccess?.();
  }

  if (propIsOpen === undefined && !internalIsOpen) {
    return (
      <button
        onClick={() => {
          if (!hasNoWhatsappAccount) {
            setInternalIsOpen(true);
          }
        }}
        disabled={hasNoWhatsappAccount}
        className="flex items-center gap-2 rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-4 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed label-large"
        title={hasNoWhatsappAccount ? "Connect a WhatsApp account to create campaigns" : "New Campaign"}
      >
        <Plus className="w-4 h-4" />
        New Campaign
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shrink-0">
          <div>
            <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">New Campaign</h3>
            <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={reset} className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 py-3 gap-2 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shrink-0">
          {(['Details', 'Leads', 'Schedule'] as const).map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-white' : 'bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${step === i + 1 ? 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]' : 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]'}`}>{label}</span>
              {i < 2 && <ChevronRight className="w-3 h-3 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral60)]" />}
            </div>
          ))}
        </div>

        <form action={formAction} className="flex flex-col flex-1 overflow-hidden">
          {/* Hidden inputs for final submission */}
          {Array.from(selectedLeadIds).map(id => (
            <input key={id} type="hidden" name="lead_ids" value={id} />
          ))}
          <input type="hidden" name="whatsapp_account_id" value={selectedAccountId} />
          <input type="hidden" name="template_id" value={selectedTemplateId} />

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* STEP 1: Details */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Campaign Name *</label>
                  <input type="text" name="name" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="e.g. May Bootcamp Outreach" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Description</label>
                  <textarea name="description" rows={2} className="w-full px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">WhatsApp Account *</label>
                  {whatsappAccounts.length === 0 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">No WhatsApp accounts connected. Go to Settings to connect one.</p>
                  ) : (
                    <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]">
                      <option value="">-- Select account --</option>
                      {whatsappAccounts.map(a => <option key={a.id} value={a.id}>{a.account_name} ({a.display_phone_number})</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Message Template *</label>
                  {templates.length === 0 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">No templates created yet. Go to Templates to create one.</p>
                  ) : (
                    <select value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)} className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]">
                      <option value="">-- Select template --</option>
                      {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  )}
                  {selectedTemplate && (
                    <div className="mt-3 p-3 rounded-md bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] whitespace-pre-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] block mb-1">Preview</span>
                      {renderTemplate(selectedTemplate.body, SAMPLE_LEAD)}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* STEP 2: Lead Selection */}
            {step === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)]">
                    {selectedLeadIds.size} of {leads.length} leads selected
                    <span className="ml-2 text-xs font-normal text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">(opted-in only)</span>
                  </p>
                  <button type="button" onClick={toggleAll} className="text-xs text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-medium hover:underline">
                    {selectedLeadIds.size === filteredLeads.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                <input type="text" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-9 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" />
                {leads.length === 0 ? (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">No eligible leads found. Add opted-in leads in the Leads section.</p>
                ) : (
                  <div className="border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    {filteredLeads.map(lead => (
                      <label key={lead.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] cursor-pointer border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] last:border-b-0">
                        <input type="checkbox" checked={selectedLeadIds.has(lead.id)} onChange={() => toggleLead(lead.id)} className="w-4 h-4 rounded border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" />
                        <div>
                          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                            {lead.first_name || lead.last_name ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim() : 'No name'}
                          </p>
                          <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">{lead.phone_number}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 3: Schedule & Confirm */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Schedule Send (optional)</label>
                  <input type="datetime-local" name="scheduled_at" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" />
                  <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Leave blank to start manually later.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Batch Size</label>
                    <input type="number" name="batch_size" defaultValue={50} min={1} max={500} className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Delay (seconds)</label>
                    <input type="number" name="delay_in_seconds" defaultValue={5} min={1} max={60} className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" />
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] p-4 space-y-2 text-sm">
                  <p className="font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-3">Campaign Summary</p>
                  <div className="flex justify-between"><span className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">Template</span><span className="font-medium">{selectedTemplate?.name ?? '—'}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">Recipients</span><span className="font-medium">{selectedLeadIds.size} leads</span></div>
                  <div className="flex justify-between"><span className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">Initial status</span><span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">DRAFT</span></div>
                </div>

                {state.message && state.message !== 'SUCCESS' && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{state.message}</p>
                )}
              </>
            )}
          </div>

          {/* Footer nav */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shrink-0">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : reset()}
              className="flex items-center gap-1 px-4 py-2 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] label-large"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => (s + 1) as Step)}
                disabled={(step === 1 && (!selectedAccountId || !selectedTemplateId)) || (step === 2 && selectedLeadIds.size === 0)}
                className="flex items-center gap-1 rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-5 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-40 label-large"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending || selectedLeadIds.size === 0}
                className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-6 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-50 label-large"
              >
                {isPending ? 'Creating...' : 'Create Campaign'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
