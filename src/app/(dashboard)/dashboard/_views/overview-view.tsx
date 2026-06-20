import React, { useEffect, useState } from 'react';
import { Activity, UserPlus, Send, FileText, MessageSquare, X } from 'lucide-react';
import { useDashboardView } from '../../_components/view-context';
import { fetchOverviewData, fetchFullActivityLog } from '@/lib/actions/dashboard';

function formatRelativeTime(dateInput: string | Date) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function OverviewView() {
  const { setView } = useDashboardView();
  const [data, setData] = useState<{ 
    totalCampaigns: number; 
    totalLeads: number; 
    savedTemplates: number;
    recentActivities: any[];
  } | null>(null);

  const [showAllActivity, setShowAllActivity] = useState(false);
  const [fullActivities, setFullActivities] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const handleViewAllActivity = async () => {
    setIsLoadingAll(true);
    try {
      const logs = await fetchFullActivityLog();
      setFullActivities(logs);
      setShowAllActivity(true);
    } catch (err) {
      console.error('Failed to fetch activity log:', err);
    } finally {
      setIsLoadingAll(false);
    }
  };

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
          <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            Dashboard Overview
          </h1>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">
            Welcome back to Send Signal. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('leads')}
            className="px-4 py-2 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] rounded-md transition-colors label-large shadow-sm cursor-pointer"
          >
            Import Leads
          </button>
          <button
            onClick={() => setView('campaigns')}
            className="px-4 py-2 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-md transition-colors label-large shadow-sm cursor-pointer"
          >
            + New Campaign
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL CAMPAIGNS */}
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col justify-between">
          <div>
            <p className="label-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] uppercase tracking-wider">
              TOTAL CAMPAIGNS
            </p>
            <p className="headline-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-3">
              {data.totalCampaigns}
            </p>
          </div>
        </div>

        {/* TOTAL LEADS */}
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col justify-between">
          <div>
            <p className="label-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] uppercase tracking-wider">
              TOTAL LEADS
            </p>
            <p className="headline-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-3">
              {data.totalLeads}
            </p>
          </div>
        </div>

        {/* SAVED TEMPLATES */}
        <div className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col justify-between">
          <div>
            <p className="label-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] uppercase tracking-wider">
              SAVED TEMPLATES
            </p>
            <p className="headline-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-3">
              {data.savedTemplates}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white flex justify-between items-center">
          <h2 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            Recent Activity
          </h2>
        </div>
        {data.recentActivities && data.recentActivities.length > 0 ? (
          <>
            <div className="px-6 py-2.5 flex justify-end border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]">
              <button
                onClick={handleViewAllActivity}
                disabled={isLoadingAll}
                className="text-xs font-semibold text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:underline cursor-pointer border-none bg-transparent disabled:opacity-50"
              >
                {isLoadingAll ? 'Loading...' : 'View all activity'}
              </button>
            </div>
            <div className="divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
              {data.recentActivities.map((activity: any) => {
                let Icon = Activity;
                let iconColor = 'text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)]';
                
                if (activity.event_type.includes('LEAD')) {
                  Icon = UserPlus;
                  iconColor = 'text-green-600 bg-green-50';
                } else if (activity.event_type.includes('CAMPAIGN')) {
                  Icon = Send;
                  iconColor = 'text-blue-600 bg-blue-50';
                } else if (activity.event_type.includes('TEMPLATE')) {
                  Icon = FileText;
                  iconColor = 'text-purple-600 bg-purple-50';
                } else if (activity.event_type.includes('MESSAGE') || activity.event_type.includes('REPLY')) {
                  Icon = MessageSquare;
                  iconColor = 'text-indigo-600 bg-indigo-50';
                }

                return (
                  <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                          {activity.description}
                        </p>
                        <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-0.5 uppercase tracking-wider text-[10px]">
                          {activity.event_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] whitespace-nowrap">
                      {formatRelativeTime(activity.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-full flex items-center justify-center mb-4 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
              <Activity size={28} />
            </div>
            <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
              No activity yet
            </h3>
            <p className="mt-1 body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] max-w-md text-center">
              When you import leads or launch campaigns, your recent events will appear here.
            </p>
            <button
              onClick={() => setView('leads')}
              className="mt-5 px-4 py-2 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] rounded-md transition-colors label-large shadow-sm cursor-pointer"
            >
              Import Leads
            </button>
          </div>
        )}
      </div>

      {/* Slide-out Activity History Drawer */}
      {showAllActivity && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden bg-black/20 animate-in fade-in duration-200" 
          onClick={() => setShowAllActivity(false)}
        >
          <div 
            className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex flex-col animate-in slide-in-from-right duration-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] flex items-center justify-between">
              <div>
                <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                  Activity History
                </h3>
                <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-0.5">
                  Recent platform updates and events
                </p>
              </div>
              <button 
                onClick={() => setShowAllActivity(false)} 
                className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] p-1.5 rounded-full hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
              {fullActivities.map((activity: any) => {
                let Icon = Activity;
                let iconColor = 'text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)]';
                
                if (activity.event_type.includes('LEAD')) {
                  Icon = UserPlus;
                  iconColor = 'text-green-600 bg-green-50';
                } else if (activity.event_type.includes('CAMPAIGN')) {
                  Icon = Send;
                  iconColor = 'text-blue-600 bg-blue-50';
                } else if (activity.event_type.includes('TEMPLATE')) {
                  Icon = FileText;
                  iconColor = 'text-purple-600 bg-purple-50';
                } else if (activity.event_type.includes('MESSAGE') || activity.event_type.includes('REPLY')) {
                  Icon = MessageSquare;
                  iconColor = 'text-indigo-600 bg-indigo-50';
                }

                return (
                  <div key={activity.id} className="flex items-start justify-between p-4 hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] transition-colors gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                          {activity.description}
                        </p>
                        <p className="text-[10px] font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1 uppercase tracking-wider">
                          {activity.event_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] whitespace-nowrap mt-1">
                      {formatRelativeTime(activity.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
