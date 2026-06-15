'use client';

import { useState, useEffect, useTransition } from 'react';
import { logoutUser } from '@/lib/actions/auth';
import { LogOut, X } from 'lucide-react';

type User = { company_name?: string | null; role?: string | null };

export function Header({ user }: { user: User }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const initial = user?.company_name ? user.company_name.charAt(0).toUpperCase() : 'U';

  // Handle click outside to close the dropdown
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

  return (
    <>
      <header className="h-14 flex items-center justify-between border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] bg-white sticky top-0 z-10 px-4 md:px-6">
        <div className="flex items-center">
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
