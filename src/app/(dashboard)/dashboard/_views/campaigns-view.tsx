'use client';

import React, { useEffect, useState } from 'react';
import { fetchCampaignsData } from '@/lib/actions/dashboard';
import { CreateCampaignWizard } from '../campaigns/create-campaign-wizard';
import { CampaignCard } from '../campaigns/campaign-card';
import { Send } from 'lucide-react';

type CampaignsData = {
  campaigns: any[];
  whatsappAccounts: any[];
  templates: any[];
  leads: any[];
};

export function CampaignsView() {
  const [data, setData] = useState<CampaignsData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadData = () => {
    fetchCampaignsData().then(setData).catch(console.error);
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

  const { campaigns, whatsappAccounts, templates, leads } = data;

  const statusCounts = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === 'DRAFT').length,
    running: campaigns.filter(c => c.status === 'RUNNING').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Campaigns</h1>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Broadcast templates to segmented contact lists.</p>
        </div>
        <CreateCampaignWizard 
          whatsappAccounts={whatsappAccounts} 
          templates={templates} 
          leads={leads}
          hasNoWhatsappAccount={whatsappAccounts.length === 0}
          onSuccess={loadData}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: statusCounts.total, color: 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]' },
          { label: 'Draft', value: statusCounts.draft, color: 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]' },
          { label: 'Running', value: statusCounts.running, color: 'text-yellow-600' },
          { label: 'Completed', value: statusCounts.completed, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
            <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">{label}</p>
            <p className={`headline-small mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] py-20 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] flex items-center justify-center text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-5">
            <Send className="w-7 h-7 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] transform -rotate-12" />
          </div>
          <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] font-semibold">
            No campaigns yet
          </h3>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-2 max-w-md">
            Create your first campaign to start sending messages.
          </p>
          <button
            onClick={() => {
              if (whatsappAccounts.length > 0) {
                setIsCreateOpen(true);
              } else {
                alert("Connect a WhatsApp account to create campaigns");
              }
            }}
            disabled={whatsappAccounts.length === 0}
            className="mt-6 px-6 py-2.5 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-md label-large shadow-sm cursor-pointer border-none font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={whatsappAccounts.length === 0 ? "Connect a WhatsApp account to create campaigns" : "New Campaign"}
          >
            New Campaign
          </button>
          <CreateCampaignWizard 
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            whatsappAccounts={whatsappAccounts} 
            templates={templates} 
            leads={leads}
            hasNoWhatsappAccount={whatsappAccounts.length === 0}
            onSuccess={loadData}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              hasNoWhatsappAccount={whatsappAccounts.length === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
