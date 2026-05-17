import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-neutral-100 text-brand-neutral-10 font-brand-body-large">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-brand-neutral-100/80 border-b border-brand-neutral-90 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-[var(--sys-typography-title-title-large-font-weight)] tracking-tight">
                Send Signal
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-[var(--sys-typography-label-label-large-font-size)] font-[var(--sys-typography-label-label-large-font-weight)]">
              <Link href="#features" className="text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors">Features</Link>
              <Link href="#use-cases" className="text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors">Use Cases</Link>
              <Link href="#pricing" className="text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors">Pricing</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[var(--sys-typography-label-label-large-font-size)] font-[var(--sys-typography-label-label-large-font-weight)] text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors">
                Log in
              </Link>
              <Link href="/register" className="rounded-full bg-brand-primary px-5 py-2.5 text-[var(--sys-typography-label-label-large-font-size)] font-[var(--sys-typography-label-label-large-font-weight)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-brand-neutral-10 py-16 text-brand-neutral-80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
                  <MessageCircle size={18} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-[var(--sys-typography-title-title-large-font-weight)] tracking-tight text-white">
                  Send Signal
                </span>
              </Link>
              <p className="text-[var(--sys-typography-body-body-medium-font-size)] max-w-sm">
                Automate your personalized WhatsApp outreach campaigns. Scale your communication while maintaining a personal touch.
              </p>
            </div>
            <div>
              <h3 className="text-white font-[var(--sys-typography-title-title-medium-font-weight)] mb-6">Product</h3>
              <ul className="space-y-4 text-[var(--sys-typography-body-body-medium-font-size)]">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#use-cases" className="hover:text-white transition-colors">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-[var(--sys-typography-title-title-medium-font-weight)] mb-6">Legal</h3>
              <ul className="space-y-4 text-[var(--sys-typography-body-body-medium-font-size)]">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Compliance Guidelines</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-brand-neutral-20 text-center text-[var(--sys-typography-body-body-small-font-size)]">
            &copy; {new Date().getFullYear()} Send Signal. All rights reserved. Built for WhatsApp Business API.
          </div>
        </div>
      </footer>
    </div>
  );
}
