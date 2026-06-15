'use client';

import { useActionState, useState } from 'react';
import { createTemplate } from '@/lib/actions/template';
import { extractPlaceholders, renderTemplate } from '@/lib/validations/template';
import { Plus, X } from 'lucide-react';

const SAMPLE_LEAD = {
  first_name: 'Alex',
  last_name: 'Johnson',
  full_name: 'Alex Johnson',
  phone_number: '+1234567890',
  email: 'alex@example.com',
};

export function CreateTemplateModal({ 
  onSuccess,
  isOpen: propIsOpen,
  onClose: propOnClose
}: { 
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const [body, setBody] = useState('');
  const [state, formAction, isPending] = useActionState(createTemplate, {});
  const detectedPlaceholders = extractPlaceholders(body);
  const preview = renderTemplate(body, SAMPLE_LEAD);

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (state?.message === 'SUCCESS' && isOpen) {
    handleClose();
    setBody('');
    onSuccess?.();
  }

  const insertPlaceholder = (key: string) => {
    setBody(prev => prev + `{${key}}`);
  };

  if (propIsOpen === undefined && !internalIsOpen) {
    return (
      <button
        onClick={() => setInternalIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-4 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors label-large"
      >
        <Plus className="w-4 h-4" />
        New Template
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">New Message Template</h3>
          <button onClick={handleClose} className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Template Name</label>
            <input
              type="text"
              name="name"
              className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]"
            />
            {state.errors?.name && <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>}
          </div>

          {/* Placeholder buttons */}
          <div>
            <p className="text-xs font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-2">Insert placeholder:</p>
            <div className="flex flex-wrap gap-2">
              {['first_name', 'last_name', 'full_name', 'phone_number', 'email'].map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => insertPlaceholder(key)}
                  className="inline-flex items-center rounded-md bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] px-2.5 py-1 text-xs font-medium text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] ring-1 ring-inset ring-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary80)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary90)] transition-colors cursor-pointer"
                >
                  {`{${key}}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Message Body</label>
              <textarea
                name="body"
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full h-[180px] px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] resize-none font-mono"
              />
              {state.errors?.body && <p className="text-xs text-red-500 mt-1">{state.errors.body[0]}</p>}
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">{body.length}/4096 characters</p>
            </div>

            <div>
              <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">
                Live Preview
                <span className="ml-2 font-normal text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">(using sample lead: Alex Johnson)</span>
              </label>
              <div className="h-[180px] overflow-y-auto px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] text-sm whitespace-pre-wrap text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)]">
                {preview}
              </div>
              {detectedPlaceholders.length > 0 && (
                <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">
                  Detected: {detectedPlaceholders.map(p => `{${p}}`).join(', ')}
                </p>
              )}
            </div>
          </div>

          {state.message && state.message !== 'SUCCESS' && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{state.message}</p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] label-large">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !body.trim()}
              className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-6 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-50 label-large"
            >
              {isPending ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
