'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteWhatsappAccount } from '@/lib/actions/whatsapp';

type WhatsappAccount = {
  id: string;
  account_name: string;
  display_phone_number: string;
  phone_number_id: string;
  is_active: boolean;
};

export function WhatsappAccountList({ accounts }: { accounts: WhatsappAccount[] }) {
  const [isPending, startTransition] = useTransition();

  if (accounts.length === 0) {
    return (
      <div className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] py-4">
        No WhatsApp accounts connected yet.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <div>
            <h4 className="font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] flex items-center gap-2">
              {account.account_name}
              {account.is_active && (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
              )}
            </h4>
            <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">
              {account.display_phone_number} • ID: {account.phone_number_id}
            </p>
          </div>
          
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to disconnect this account?')) {
                startTransition(() => {
                  deleteWhatsappAccount(account.id);
                });
              }
            }}
            disabled={isPending}
            className="p-2 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-error-error60)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-error-error95)] rounded-md transition-colors disabled:opacity-50"
            title="Disconnect Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
