'use client';

import { LogOut } from 'lucide-react';
import { logoutUser } from '@/lib/actions/auth';

type User = { company_name?: string | null; role?: string | null };

export function Header({ user }: { user: User }) {
  const initial = user?.company_name ? user.company_name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white sticky top-0 z-10">
      <div className="flex items-center">
        {/* Mobile menu button placeholder */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[var(--sys-color-roles-1-primary-roles-primary-container-color-role)] flex items-center justify-center text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold text-sm shadow-sm">
            {initial}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] leading-tight">
              {user?.company_name}
            </span>
            <span className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">
              {user?.role === 'OWNER' ? 'Workspace Owner' : 'Member'}
            </span>
          </div>
        </div>
        
        <div className="h-6 w-px bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] mx-2"></div>
        
        <form action={logoutUser}>
          <button 
            type="submit"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-error-error95)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-error-error60)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Log out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
