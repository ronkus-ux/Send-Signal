'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useDashboardView, DashboardView } from './view-context';

const navigation: { name: string; view: DashboardView }[] = [
  { name: 'Overview', view: 'overview' },
  { name: 'Leads', view: 'leads' },
  { name: 'Templates', view: 'templates' },
  { name: 'Campaigns', view: 'campaigns' },
  { name: 'Conversations', view: 'conversations' },
  { name: 'Analytics', view: 'analytics' },
  { name: 'Settings', view: 'settings' },
];

export function Sidebar() {
  const { view, setView } = useDashboardView();

  return (
    <aside className="w-64 border-r border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white hidden md:flex flex-col">
      {/* Sidebar Top Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        <button
          onClick={() => setView('overview')}
          className="flex items-center gap-2.5 no-underline border-none bg-transparent cursor-pointer text-left focus:outline-none"
        >
          <Send className="w-5 h-5 text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] transform -rotate-12" />
          <span className="font-bold text-lg tracking-tight text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            Send Signal
          </span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const trulyActive = view === item.view;

          return (
            <button
              key={item.name}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border-none bg-transparent cursor-pointer text-left focus:outline-none ${
                trulyActive
                  ? 'bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold'
                  : 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
