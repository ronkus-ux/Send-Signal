'use client';

import React, { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error boundary caught:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] text-center space-y-6">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] max-w-md mx-auto">
          An unexpected error occurred while loading this dashboard view. We&apos;ve logged the details and will investigate.
        </p>
        {error.message && (
          <code className="block p-3 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded text-xs text-left font-mono text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] overflow-x-auto">
            {error.message}
          </code>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => (window.location.href = '/dashboard')}
          className="px-4 py-2 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white hover:bg-neutral-50 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] rounded-lg transition-all shadow-sm label-large"
        >
          Go to Overview
        </button>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-lg transition-all shadow-sm label-large"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
