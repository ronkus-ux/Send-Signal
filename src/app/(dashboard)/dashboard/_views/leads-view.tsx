'use client';

import React, { useEffect, useState } from 'react';
import { fetchLeadsData } from '@/lib/actions/dashboard';
import { CsvImporter } from '../leads/csv-importer';
import { AddLeadModal } from '../leads/add-lead-modal';
import { LeadTable } from '../leads/lead-table';

export function LeadsView() {
  const [leads, setLeads] = useState<any[] | null>(null);

  const loadData = () => {
    fetchLeadsData().then(setLeads).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!leads) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight">Leads Database</h1>
          <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Manage your contacts, tags, and communication consent.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <CsvImporter onSuccess={loadData} />
          <AddLeadModal onSuccess={loadData} />
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Total Leads</p>
          <p className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-1">{leads.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Opted In</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{leads.filter(l => l.opt_in).length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Unsubscribed</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">{leads.filter(l => l.unsubscribed).length}</p>
        </div>
      </div>

      <LeadTable leads={leads} />
    </div>
  );
}
