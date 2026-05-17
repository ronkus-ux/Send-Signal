'use client';

import { useTransition, useState } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { deleteTemplate } from '@/lib/actions/template';
import { renderTemplate } from '@/lib/validations/template';

const SAMPLE_LEAD = {
  first_name: 'Alex',
  last_name: 'Johnson',
  full_name: 'Alex Johnson',
  phone_number: '+1234567890',
  email: 'alex@example.com',
};

type Template = {
  id: string;
  name: string;
  body: string;
  created_at: string | Date;
  placeholder_schema_json: any;
};

function TemplateCard({ template }: { template: Template }) {
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);
  const placeholders = Array.isArray(template.placeholder_schema_json) ? template.placeholder_schema_json : [];

  return (
    <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] leading-tight">{template.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowPreview(v => !v)}
              className="p-1.5 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] rounded-md transition-colors"
              title={showPreview ? 'Show raw template' : 'Preview with sample data'}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete template "${template.name}"?`)) {
                  startTransition(() => deleteTemplate(template.id));
                }
              }}
              disabled={isPending}
              className="p-1.5 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Delete template"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {placeholders.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {placeholders.map((p: string) => (
              <span key={p} className="inline-flex items-center rounded-md bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary95)] px-2 py-0.5 text-xs font-medium text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] ring-1 ring-inset ring-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary80)]">
                {`{${p}}`}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-5 flex-1">
        <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)] whitespace-pre-wrap leading-relaxed">
          {showPreview ? renderTemplate(template.body, SAMPLE_LEAD) : template.body}
        </p>
      </div>
      <div className="px-5 py-3 bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">
        {template.body.length} chars · Created {new Date(template.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}

export function TemplateGrid({ templates }: { templates: Template[] }) {
  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] p-12 text-center">
        <h3 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">No templates yet</h3>
        <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Create your first reusable message template to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {templates.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
