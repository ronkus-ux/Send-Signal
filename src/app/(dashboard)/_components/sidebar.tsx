'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  Settings 
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
  { name: 'Templates', href: '/dashboard/templates', icon: FileText },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        <span className="font-bold text-xl tracking-tight text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Send Signal</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // For overview, we only want exact match
          const trulyActive = item.href === '/dashboard' ? pathname === '/dashboard' : isActive;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                trulyActive
                  ? 'bg-[var(--sys-color-roles-1-primary-roles-primary-container-color-role)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)]'
                  : 'text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
