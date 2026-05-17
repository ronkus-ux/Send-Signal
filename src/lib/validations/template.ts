import { z } from 'zod';

export const SUPPORTED_PLACEHOLDERS = [
  'first_name',
  'last_name',
  'full_name',
  'phone_number',
  'email',
];

export const TemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  body: z.string().min(1, 'Template body is required').max(4096, 'Template body must be under 4096 characters'),
});

export type TemplateFormState = {
  errors?: {
    name?: string[];
    body?: string[];
  };
  message?: string;
};

export function extractPlaceholders(body: string): string[] {
  const regex = /\{(\w+)\}/g;
  const found: string[] = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    if (!found.includes(match[1])) found.push(match[1]);
  }
  return found;
}

export function renderTemplate(body: string, variables: Record<string, string>): string {
  return body.replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
}
