'use client';

import React, { useEffect, useState } from 'react';
import { fetchSettingsData } from '@/lib/actions/dashboard';
import { ConnectWhatsappForm } from '../settings/client-form';
import { WhatsappAccountList } from '../settings/account-list';

type SettingsData = {
  company_name: string;
  email: string;
  accounts: any[];
};

export function SettingsView() {
  const [data, setData] = useState<SettingsData | null>(null);

  const loadData = () => {
    fetchSettingsData().then(setData).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight mb-6">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        
        {/* Profile Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-4">Profile Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Company Name</label>
              <div className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                {data.company_name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Email Address</label>
              <div className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                {data.email}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Accounts Section */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-1">WhatsApp Accounts</h2>
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mb-4">Connect and manage your WhatsApp Business API credentials.</p>
            </div>
            <ConnectWhatsappForm onSuccess={loadData} />
          </div>

          <WhatsappAccountList accounts={data.accounts} onSuccess={loadData} />
        </div>

      </div>
    </div>
  );
}
