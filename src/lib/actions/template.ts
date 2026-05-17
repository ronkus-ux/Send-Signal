'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { getSession } from '../auth/session';
import { TemplateSchema, TemplateFormState, extractPlaceholders } from '../validations/template';

export async function createTemplate(
  state: TemplateFormState,
  formData: FormData
): Promise<TemplateFormState> {
  const session = await getSession();
  if (!session?.user) return { message: 'Unauthorized' };

  const validated = TemplateSchema.safeParse({
    name: formData.get('name'),
    body: formData.get('body'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, body } = validated.data;
  const placeholders = extractPlaceholders(body);

  try {
    await prisma.template.create({
      data: {
        user_id: session.user.id,
        name,
        body,
        placeholder_schema_json: placeholders,
      },
    });

    revalidatePath('/dashboard/templates');
    return { message: 'SUCCESS' };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return { message: 'A template with this name already exists.' };
    }
    console.error('Failed to create template:', error);
    return { message: 'An internal error occurred. Please try again.' };
  }
}

export async function deleteTemplate(templateId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  await prisma.template.deleteMany({
    where: { id: templateId, user_id: session.user.id },
  });

  revalidatePath('/dashboard/templates');
}
