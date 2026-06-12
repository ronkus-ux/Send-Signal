import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { Sidebar } from './_components/sidebar';
import { Header } from './_components/header';
import { ViewProvider } from './_components/view-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <ViewProvider>
      <div className="flex min-h-screen bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={session.user} />

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ViewProvider>
  );
}

