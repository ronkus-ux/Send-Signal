'use client';

import { useState, useEffect, useTransition } from 'react';
import { logoutUser } from '@/lib/actions/auth';

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
      <header className="h-16 flex items-center justify-between border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white sticky top-0 z-10 px-6 md:px-8">
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
              <div className="absolute right-0 top-11 mt-1.5 w-48 bg-white border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-lg shadow-lg py-1.5 z-20">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutConfirmOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] transition-colors border-none bg-transparent cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
              Confirm Logout
            </h3>
            <p className="mt-2 text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">
              Are you sure you want to log out of Send Signal?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                disabled={isPending}
                className="px-4 py-2 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
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
                className="px-4 py-2 bg-red-600 text-sm font-medium text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Logging out...' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
