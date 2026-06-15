import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header action row skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-md"></div>
          <div className="h-4 w-72 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-md"></div>
      </div>

      {/* Grid of stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] space-y-3"
          >
            <div className="h-4 w-24 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-md"></div>
            <div className="h-8 w-16 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Large Content Card skeleton */}
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
        <div className="p-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <div className="h-5 w-36 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-md"></div>
        </div>
        <div className="p-12 flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="w-16 h-16 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] border-t-transparent animate-spin"></div>
          </div>
          <div className="h-5 w-48 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] rounded-md"></div>
          <div className="h-4 w-72 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95)] rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
