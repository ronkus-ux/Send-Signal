'use client';

import Link from 'next/link';
import {
  Send,
  LayoutDashboard,
  Users,
  FileText,
  MessageCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { useDashboardView, DashboardView } from './view-context';

const navigation: {
  name: string;
  view: DashboardView;
  icon: React.ComponentType<{ size?: number; className?: string }>
}[] = [
    { name: 'Overview', view: 'overview', icon: LayoutDashboard },
    { name: 'Leads', view: 'leads', icon: Users },
    { name: 'Templates', view: 'templates', icon: FileText },
    { name: 'Campaigns', view: 'campaigns', icon: Send },
    { name: 'Conversations', view: 'conversations', icon: MessageCircle },
    { name: 'Analytics', view: 'analytics', icon: BarChart3 },
    { name: 'Settings', view: 'settings', icon: Settings },
  ];

export function Sidebar() {
  const { view, setView } = useDashboardView();

  return (
    <aside className="w-64 border-r border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] bg-white hidden md:flex flex-col">
      {/* Sidebar Top Logo */}
      <div className="h-14 flex items-center pl-5 pr-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)]">
        <button
          onClick={() => setView('overview')}
          className="flex items-center gap-1 group no-underline border-none bg-transparent cursor-pointer text-left focus:outline-none"
        >
          <div className="flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
            <Send size={20} strokeWidth={2} className="text-brand-primary transform -rotate-12" />
          </div>
          <span className="title-medium text-brand-neutral-10">
            Send Signal
          </span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 pl-3 pr-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const trulyActive = view === item.view;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium rounded-lg transition-colors border-none cursor-pointer text-left focus:outline-none ${trulyActive
                  ? 'bg-[rgba(3,124,230,0.08)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold'
                  : 'bg-transparent text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]'
                }`}
            >
              <Icon size={20} className="shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
