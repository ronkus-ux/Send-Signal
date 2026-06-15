'use client';

import { Trash2, Copy, Check, Smartphone } from 'lucide-react';
import { useTransition, useState } from 'react';
import { deleteWhatsappAccount } from '@/lib/actions/whatsapp';

type WhatsappAccount = {
  id: string;
  account_name: string;
  display_phone_number: string;
  phone_number_id: string;
  is_active: boolean;
  webhook_verify_token?: string;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="p-1 hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded transition-colors text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] ml-2 flex-shrink-0"
      title="Copy Token"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function WhatsappAccountList({ accounts, onSuccess }: { accounts: WhatsappAccount[], onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  if (accounts.length === 0) {
    return (
      <div className="bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]/50 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] py-12 px-4 text-center flex flex-col items-center justify-center mt-2">
        <div className="w-14 h-14 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] flex items-center justify-center text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-3">
          <Smartphone className="w-6 h-6" />
        </div>
        <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] max-w-sm">
          No WhatsApp accounts connected yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <div className="flex items-center justify-between">
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
                  startTransition(async () => {
                    try {
                      await deleteWhatsappAccount(account.id);
                      onSuccess?.();
                    } catch (err) {
                      console.error('Failed to delete whatsapp account:', err);
                    }
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

          {account.webhook_verify_token && (
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)]">
              <span className="text-xs font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] w-36 flex-shrink-0">Webhook Verify Token:</span>
              <div className="flex-grow flex items-center bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] rounded px-2.5 py-1.5 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
                <code className="text-xs font-mono text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] select-all truncate flex-grow">
                  {account.webhook_verify_token}
                </code>
                <CopyButton text={account.webhook_verify_token} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
