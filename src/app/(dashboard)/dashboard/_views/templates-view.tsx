'use client';

import React, { useEffect, useState } from 'react';
import { fetchTemplatesData } from '@/lib/actions/dashboard';
import { CreateTemplateModal } from '../templates/create-template-modal';
import { TemplateGrid } from '../templates/template-grid';

export function TemplatesView() {
  const [templates, setTemplates] = useState<any[] | null>(null);

  const loadData = () => {
    fetchTemplatesData().then(setTemplates).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!templates) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Message Templates</h1>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Create reusable messages with dynamic placeholders for personalisation.</p>
        </div>
        <CreateTemplateModal onSuccess={loadData} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Total Templates</p>
          <p className="headline-small text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-1">{templates.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">With Placeholders</p>
          <p className="headline-small text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] mt-1">
            {templates.filter(t => Array.isArray(t.placeholder_schema_json) && (t.placeholder_schema_json as Record<string, unknown>[]).length > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <p className="label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Used in Campaigns</p>
          <p className="headline-small text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-1">0</p>
        </div>
      </div>

      <TemplateGrid templates={templates} onSuccess={loadData} />
    </div>
  );
}
