'use client';

import React, { useEffect, useState } from 'react';
import { BarChart2, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useDashboardView } from '../../_components/view-context';
import { fetchAnalyticsData } from '@/lib/actions/dashboard';

type AnalyticsData = {
  metrics: {
    totalCampaigns: number;
    totalSent: number;
    totalDelivered: number;
    deliveryRate: number;
    totalReplied: number;
    replyRate: number;
    totalConverted: number;
  };
  recentCampaigns: any[];
};

export function AnalyticsView() {
  const { setView } = useDashboardView();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalyticsData().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { metrics, recentCampaigns } = data;

  if (metrics.totalCampaigns === 0) {
    return (
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Analytics & Reporting</h1>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Track campaign performance and conversion metrics.</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] py-20 px-6 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-full flex items-center justify-center text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mb-5">
            <BarChart2 className="w-7 h-7" />
          </div>
          <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] font-semibold">
            Advanced Analytics Coming Soon
          </h3>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-2 max-w-md">
            Deep dive reports and historic snapshot visualizations are under development.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Analytics & Reporting</h1>
        <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">
          Track campaign performance and conversion metrics.
        </p>
      </div>
      
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Send size={20} />
            </div>
            <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Total Sent</p>
          </div>
          <p className="headline-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-2">
            {metrics.totalSent.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
              <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Delivered</p>
            </div>
            <span className="label-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {metrics.deliveryRate}% Rate
            </span>
          </div>
          <p className="headline-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-2">
            {metrics.totalDelivered.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <MessageSquare size={20} />
              </div>
              <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Replies</p>
            </div>
            <span className="label-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {metrics.replyRate}% Rate
            </span>
          </div>
          <p className="headline-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-2">
            {metrics.totalReplied.toLocaleString()}
          </p>
        </div>

        <div className="bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] p-6 rounded-xl border border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] flex flex-col text-white">
          <div className="flex items-center gap-3 mb-2 text-white/80">
            <div className="p-2 bg-white/20 rounded-lg">
              <BarChart2 size={20} />
            </div>
            <p className="label-large text-white/80">Conversions</p>
          </div>
          <p className="headline-medium mt-2">
            {metrics.totalConverted.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
        <div className="p-5 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex justify-between items-center bg-gray-50/50">
          <h2 className="title-medium text-gray-900">Recent Campaigns</h2>
          <button 
            onClick={() => setView('campaigns')} 
            className="label-large text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:underline bg-transparent border-none cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Sent</th>
                <th className="px-6 py-4 font-medium text-right">Delivered</th>
                <th className="px-6 py-4 font-medium text-right">Read</th>
                <th className="px-6 py-4 font-medium text-right">Replies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-xs text-gray-500">{new Date(campaign.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${campaign.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' : 
                        campaign.status === 'RUNNING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {campaign.total_sent} <span className="text-gray-400 text-xs">/ {campaign.total_recipients}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">{campaign.total_delivered}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{campaign.total_read}</td>
                  <td className="px-6 py-4 text-right font-medium text-[var(--sys-color-roles-1-primary-roles-primary-color-role)]">
                    {campaign.total_replied}
                  </td>
                </tr>
              ))}
              {recentCampaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
