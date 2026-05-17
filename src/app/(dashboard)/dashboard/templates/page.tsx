import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { CreateTemplateModal } from './create-template-modal';
import { TemplateGrid } from './template-grid';

export default async function TemplatesPage() {
  const session = await getSession();

  const templates = await prisma.template.findMany({
    where: {
      user_id: session!.user.id,
      is_archived: false,
      deleted_at: null,
    },
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight">Message Templates</h1>
          <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Create reusable messages with dynamic placeholders for personalisation.</p>
        </div>
        <CreateTemplateModal />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Total Templates</p>
          <p className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-1">{templates.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">With Placeholders</p>
          <p className="text-2xl font-semibold text-[var(--sys-color-roles-1-primary-roles-primary-color-role)] mt-1">
            {templates.filter(t => Array.isArray(t.placeholder_schema_json) && (t.placeholder_schema_json as Record<string, unknown>[]).length > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] shadow-sm">
          <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)]">Used in Campaigns</p>
          <p className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mt-1">0</p>
        </div>
      </div>

      <TemplateGrid templates={templates} />
    </div>
  );
}
