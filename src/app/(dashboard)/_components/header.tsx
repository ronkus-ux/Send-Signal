'use client';

type User = { company_name?: string | null; role?: string | null };

export function Header({ user }: { user: User }) {
  const initial = user?.company_name ? user.company_name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 flex items-center justify-between border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-white sticky top-0 z-10 px-6 md:px-8">
      <div className="flex items-center">
        {/* Left side empty space to match spacing */}
      </div>
      
      <div className="flex items-center gap-3">
        <span className="font-medium text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
          {user?.company_name}
        </span>
        <div className="h-9 w-9 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] flex items-center justify-center text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] font-semibold text-sm shadow-sm shrink-0">
          {initial}
        </div>
      </div>
    </header>
  );
}
