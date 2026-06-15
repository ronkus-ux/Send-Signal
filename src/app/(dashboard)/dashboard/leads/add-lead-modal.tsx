'use client';

import { useActionState, useState } from 'react';
import { addLead } from '@/lib/actions/lead';
import { Plus, X } from 'lucide-react';

export function AddLeadModal({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addLead, {});

  if (state?.message === 'SUCCESS' && isOpen) {
    setIsOpen(false);
    onSuccess?.();
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-4 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors label-large"
      >
        <Plus className="w-4 h-4" />
        Add Lead
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <div>
            <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Add New Lead</h3>
            <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-0.5">Manually add a contact to your database.</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-4">
          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Phone Number *</label>
            <input type="text" name="phone_number" className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" />
            {state.errors?.phone_number && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.phone_number[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">First Name</label>
              <input type="text" name="first_name" className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" />
            </div>
            <div>
              <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Last Name</label>
              <input type="text" name="last_name" className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" />
            </div>
          </div>

          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Email Address</label>
            <input type="email" name="email" className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" />
            {state.errors?.email && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.email[0]}</p>}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" name="opt_in" id="opt_in" defaultChecked className="w-4 h-4 rounded border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] focus:ring-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" />
            <label htmlFor="opt_in" className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Contact has opted in to receive messages</label>
          </div>

          {state.message && state.message !== 'SUCCESS' && (
            <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] bg-red-50 p-3 rounded-md">
              {state.message}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] label-large"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-6 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-50 label-large"
            >
              {isPending ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
