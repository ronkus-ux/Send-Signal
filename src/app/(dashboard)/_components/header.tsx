'use client';

import { useState, useEffect, useTransition } from 'react';
import { logoutUser } from '@/lib/actions/auth';
import {
  LogOut,
  X,
  Menu,
  Send,
  LayoutDashboard,
  Users,
  FileText,
  MessageCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { useDashboardView, DashboardView } from './view-context';

type User = { company_name?: string | null; role?: string | null };

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

export function Header({ user }: { user: User }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { view, setView } = useDashboardView();

  const initial = user?.company_name ? user.company_name.charAt(0).toUpperCase() : 'U';

  // Handle click outside to close profile dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#profile-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isDropdownOpen]);

  // Lock body scroll when mobile navigation menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="h-14 flex items-center justify-between border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] bg-white sticky top-0 z-30 px-4 md:px-6">
        {/* Mobile Header Left: Hamburger + Logo */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 -ml-1 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <button
            onClick={() => {
              setView('overview');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 group no-underline border-none bg-transparent cursor-pointer text-left focus:outline-none"
          >
            <div className="flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
              <Send size={18} strokeWidth={2} className="text-brand-primary transform -rotate-12" />
            </div>
            <span className="title-medium text-brand-neutral-10 text-base font-semibold">
              Send Signal
            </span>
          </button>
        </div>

        {/* Desktop Header Left: Empty space to match sidebar layout */}
        <div className="hidden md:flex items-center">
          {/* Left side empty space to match spacing */}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative" id="profile-dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 border-none bg-transparent cursor-pointer outline-none focus:outline-none"
            >
              <span className="font-medium text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                {user?.company_name}
              </span>
              <div className="h-9 w-9 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] flex items-center justify-center text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold text-sm shadow-sm shrink-0 hover:opacity-90 transition-opacity">
                {initial}
              </div>
            </button>
            
            {isDropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div 
                  className="fixed inset-0 bg-black/15 backdrop-blur-[1px] cursor-default z-30"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-11 mt-1.5 w-48 bg-white border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-lg shadow-lg py-1.5 z-40">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsLogoutConfirmOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 label-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] transition-colors border-none bg-transparent cursor-pointer text-left focus:outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 flex flex-col">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 top-14 bg-black/20 backdrop-blur-xs cursor-default"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Drawer Content */}
          <div className="relative z-50 bg-white border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-xl px-3 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="px-3 pb-2 mb-2 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] text-xs font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] uppercase tracking-wider">
              Navigation
            </div>
            {navigation.map((item) => {
              const trulyActive = view === item.view;
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors border-none cursor-pointer text-left focus:outline-none ${
                    trulyActive
                      ? 'bg-[rgba(3,124,230,0.08)] text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold'
                      : 'bg-transparent text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-5 max-w-[340px] w-full border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute top-4 right-4 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] p-1 rounded-full hover:bg-neutral-100 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center focus:outline-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
              Confirm Logout
            </h3>
            <p className="mt-2 label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">
              Are you sure you want to log out of your account?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                disabled={isPending}
                className="px-4 py-2 bg-transparent border-none text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] label-large rounded-lg hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  startTransition(async () => {
                    await logoutUser();
                  });
                }}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white label-large rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Logging out...' : 'Yes, log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
