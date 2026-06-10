'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Menu, X } from 'lucide-react';

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] transition-all duration-300 px-2 md:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group no-underline">
            <div className="flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
              <Send size={20} strokeWidth={2} className="text-brand-primary transform -rotate-12" />
            </div>
            <span className="title-medium text-brand-neutral-10">
              Send Signal
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-5 title-medium">
            <Link href="#features" className="text-brand-neutral-40 hover:text-brand-neutral-10 transition-colors no-underline">Features</Link>
            <Link href="#use-cases" className="text-brand-neutral-40 hover:text-brand-neutral-10 transition-colors no-underline">Use Cases</Link>
            <Link href="#pricing" className="text-brand-neutral-40 hover:text-brand-neutral-10 transition-colors no-underline">Pricing</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/register" className="rounded bg-brand-primary px-8 py-2.5 label-large text-brand-on-primary shadow-sm hover:bg-brand-primary-60 transition-colors no-underline">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center p-2 text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-lg transition-all duration-300">
          <div className="flex flex-col px-4 py-6 gap-4">
            <Link 
              href="#features" 
              onClick={() => setIsOpen(false)}
              className="text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors title-medium py-2 no-underline"
            >
              Features
            </Link>
            <Link 
              href="#use-cases" 
              onClick={() => setIsOpen(false)}
              className="text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors title-medium py-2 no-underline"
            >
              Use Cases
            </Link>
            <Link 
              href="#pricing" 
              onClick={() => setIsOpen(false)}
              className="text-brand-neutral-30 hover:text-brand-neutral-10 transition-colors title-medium py-2 no-underline"
            >
              Pricing
            </Link>
            <hr className="border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] my-1" />
            <Link 
              href="/register" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full rounded bg-brand-primary py-3 label-large text-brand-on-primary shadow-sm hover:bg-brand-primary-60 transition-colors no-underline"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
