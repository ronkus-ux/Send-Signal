import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { Sidebar } from './_components/sidebar';
import { Header } from './_components/header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  // Check if they have any connected WhatsApp account to display warning banner and disable campaign triggers
  const whatsappAccountCount = await prisma.whatsappAccount.count({
    where: { user_id: session.user.id },
  });

  return (
    <div className="flex min-h-screen bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={session.user} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {whatsappAccountCount === 0 && (
            <div className="mb-6 py-2.5 px-4 bg-indigo-50/80 backdrop-blur-sm border border-indigo-200/60 rounded-xl text-indigo-800 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm transition-all animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>Connect your WhatsApp Business Account to start sending campaigns. You can connect it in Settings or resume onboarding.</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="/onboarding" 
                  className="text-xs font-semibold uppercase tracking-wider border border-indigo-300 hover:bg-indigo-100/50 text-indigo-900 px-3 py-1.5 rounded-lg transition-colors no-underline inline-block shrink-0"
                >
                  Resume Onboarding
                </a>
                <a 
                  href="/dashboard/settings" 
                  className="text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm no-underline inline-block shrink-0"
                >
                  Go to Settings
                </a>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

