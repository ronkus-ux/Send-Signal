'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Send } from 'lucide-react';
import { logoutUser } from '@/lib/actions/auth';

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Leads', href: '/dashboard/leads' },
  { name: 'Templates', href: '/dashboard/templates' },
  { name: 'Campaigns', href: '/dashboard/campaigns' },
  { name: 'Conversations', href: '/dashboard/conversations' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white hidden md:flex flex-col">
      {/* Sidebar Top Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
          <Send className="w-5 h-5 text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] transform -rotate-12" />
          <span className="font-bold text-lg tracking-tight text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            Send Signal
          </span>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // For overview, we only want exact match
          const trulyActive = item.href === '/dashboard' ? pathname === '/dashboard' : isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                trulyActive
                  ? 'bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold'
                  : 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Bottom Logout */}
      <div className="p-4 border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-lg transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
              N
            </div>
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
