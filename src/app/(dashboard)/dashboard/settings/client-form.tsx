'use client';

import { useActionState, useState } from 'react';
import { connectWhatsappAccount } from '@/lib/actions/whatsapp';

export function ConnectWhatsappForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(connectWhatsappAccount, {});

  // Close modal on success
  if (state?.message === 'SUCCESS' && isOpen) {
    setIsOpen(false);
    // Reset state implicitly by re-rendering without form
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary30)] transition-colors"
      >
        Connect Account
      </button>
    );
  }

  return (
    <div className="mt-6 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Connect WhatsApp Account</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]"
        >
          Cancel
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Account Name</label>
            <input type="text" name="account_name" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="e.g. Main Marketing" />
            {state.errors?.account_name && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.account_name[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Display Phone Number</label>
            <input type="text" name="display_phone_number" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="+1234567890" />
            {state.errors?.display_phone_number && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.display_phone_number[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Phone Number ID</label>
            <input type="text" name="phone_number_id" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="From Meta Developer Console" />
            {state.errors?.phone_number_id && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.phone_number_id[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Business Account ID</label>
            <input type="text" name="business_account_id" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="From Meta Developer Console" />
            {state.errors?.business_account_id && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.business_account_id[0]}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Permanent Access Token</label>
          <input type="password" name="access_token" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="EAAL..." />
          {state.errors?.access_token && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.access_token[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] mb-1">Webhook Verify Token</label>
          <input type="text" name="webhook_verify_token" className="w-full h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]" placeholder="Your custom verify token" />
          {state.errors?.webhook_verify_token && <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">{state.errors.webhook_verify_token[0]}</p>}
        </div>

        {state.message && state.message !== 'SUCCESS' && (
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)]">
            {state.message}
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary30)] transition-colors disabled:opacity-50"
          >
            {isPending ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </form>
    </div>
  );
}
