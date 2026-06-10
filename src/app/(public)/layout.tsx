import React from 'react';
import { PublicHeader } from './_components/header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-brand-neutral-100 text-brand-neutral-10 font-brand-body-large overflow-hidden">
      <PublicHeader />
      <main className="flex-1 overflow-hidden h-full">
        {children}
      </main>

    </div>
  );
}
