import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const LeadSchema = z.object({
  phone_number: z.string().regex(phoneRegex, 'Invalid phone format (must include country code, e.g., +1234567890)'),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  opt_in: z.boolean().default(true),
});

export type LeadFormState = {
  errors?: {
    phone_number?: string[];
    first_name?: string[];
    last_name?: string[];
    email?: string[];
  };
  message?: string;
};
