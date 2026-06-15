'use client';

import { useActionState, useState, useEffect } from 'react';
import { connectWhatsappAccount } from '@/lib/actions/whatsapp';
import { Eye, EyeOff } from 'lucide-react';

export function ConnectWhatsappForm({ 
  onSuccess, 
  onCancel 
}: { 
  onSuccess?: () => void; 
  onCancel?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(connectWhatsappAccount, {});
  const [showAccessToken, setShowAccessToken] = useState(false);

  // Trigger onSuccess callback when connection is successful
  useEffect(() => {
    if (state?.message === 'SUCCESS') {
      onSuccess?.();
    }
  }, [state?.message, onSuccess]);

  return (
    <div className="mt-4 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]/50 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] p-6 mb-6">
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">
              Account Name
            </label>
            <input 
              type="text" 
              name="account_name" 
              className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" 
            />
            {state.errors?.account_name && (
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">
                {state.errors.account_name[0]}
              </p>
            )}
          </div>
          
          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">
              Display Phone Number
            </label>
            <input 
              type="text" 
              name="display_phone_number" 
              className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" 
            />
            {state.errors?.display_phone_number && (
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">
                {state.errors.display_phone_number[0]}
              </p>
            )}
          </div>
          
          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">
              WhatsApp Phone Number ID
            </label>
            <input 
              type="text" 
              name="phone_number_id" 
              className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" 
            />
            {state.errors?.phone_number_id && (
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">
                {state.errors.phone_number_id[0]}
              </p>
            )}
          </div>
          
          <div>
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">
              Business Account ID
            </label>
            <input 
              type="text" 
              name="business_account_id" 
              className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" 
            />
            {state.errors?.business_account_id && (
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">
                {state.errors.business_account_id[0]}
              </p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">
              System User Access Token
            </label>
            <div className="relative flex items-center w-full">
              <input 
                type={showAccessToken ? 'text' : 'password'} 
                name="access_token" 
                className="w-full h-10 pl-3 pr-10 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]" 
              />
              <button
                type="button"
                onClick={() => setShowAccessToken(!showAccessToken)}
                className="absolute right-3 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 transition-colors"
                title={showAccessToken ? 'Hide access token' : 'Show access token'}
              >
                {showAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {state.errors?.access_token && (
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-1">
                {state.errors.access_token[0]}
              </p>
            )}
          </div>
        </div>
        
        {state.message && state.message !== 'SUCCESS' && (
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-2">
            {state.message}
          </p>
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded-md bg-white border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] transition-colors label-large cursor-pointer shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-6 py-2 text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-50 label-large cursor-pointer"
          >
            {isPending ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </form>
    </div>
  );
}
