import { z } from 'zod';

export const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  description: z.string().optional(),
  whatsapp_account_id: z.string().min(1, 'You must select a WhatsApp account'),
  template_id: z.string().min(1, 'You must select a message template'),
  lead_ids: z.array(z.string()).min(1, 'You must select at least one lead'),
  scheduled_at: z.string().optional().nullable(),
  batch_size: z.coerce.number().int().min(1).max(500).default(50),
  delay_in_seconds: z.coerce.number().int().min(1).max(60).default(5),
});

export type CreateCampaignFormState = {
  errors?: Partial<Record<keyof z.infer<typeof CreateCampaignSchema>, string[]>>;
  message?: string;
  campaignId?: string;
};
