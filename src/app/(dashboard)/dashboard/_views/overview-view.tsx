'use client';

import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { useDashboardView } from '../../_components/view-context';
import { fetchOverviewData } from '@/lib/actions/dashboard';

export function OverviewView() {
  const { setView } = useDashboardView();
  const [data, setData] = useState<{ totalCampaigns: number; totalLeads: number; savedTemplates: number } | null>(null);

  useEffect(() => {
    fetchOverviewData().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Upper header action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">
            Welcome back to Send Signal. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('leads')}
            className="px-4 py-2 text-sm font-medium border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white hover:bg-neutral-50 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] rounded-lg transition-all shadow-sm cursor-pointer"
          >
            Import Leads
          </button>
          <button
            onClick={() => setView('campaigns')}
            className="px-4 py-2 text-sm font-medium bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:opacity-90 text-white rounded-lg transition-all shadow-sm cursor-pointer"
          >
            + New Campaign
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL CAMPAIGNS */}
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] tracking-wider">
              TOTAL CAMPAIGNS
            </p>
            <p className="text-3xl font-bold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-3">
              {data.totalCampaigns}
            </p>
          </div>
        </div>

        {/* TOTAL LEADS */}
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] tracking-wider">
              TOTAL LEADS
            </p>
            <p className="text-3xl font-bold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-3">
              {data.totalLeads}
            </p>
          </div>
        </div>

        {/* SAVED TEMPLATES */}
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] tracking-wider">
              SAVED TEMPLATES
            </p>
            <p className="text-3xl font-bold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-3">
              {data.savedTemplates}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white">
          <h2 className="text-lg font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            Recent Activity
          </h2>
        </div>
        <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-full flex items-center justify-center mb-4 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            <Activity size={28} />
          </div>
          <h3 className="text-base font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            No activity yet
          </h3>
          <p className="mt-1 text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] max-w-md text-center">
            When you import leads or launch campaigns, your recent events will appear here.
          </p>
          <button
            onClick={() => setView('leads')}
            className="mt-5 px-4 py-2 text-sm font-medium border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white hover:bg-neutral-50 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] rounded-lg transition-all shadow-sm cursor-pointer"
          >
            Import Leads
          </button>
        </div>
      </div>
    </div>
  );
}
