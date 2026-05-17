import { z } from 'zod';

export const ConnectWhatsappSchema = z.object({
  account_name: z.string().min(1, 'Account name is required'),
  phone_number_id: z.string().min(1, 'Phone Number ID is required'),
  business_account_id: z.string().min(1, 'WhatsApp Business Account ID is required'),
  access_token: z.string().min(1, 'Access Token is required'),
  webhook_verify_token: z.string().min(1, 'Webhook Verify Token is required'),
  display_phone_number: z.string().min(1, 'Display Phone Number is required'),
});

export type ConnectWhatsappFormState = {
  errors?: {
    account_name?: string[];
    phone_number_id?: string[];
    business_account_id?: string[];
    access_token?: string[];
    webhook_verify_token?: string[];
    display_phone_number?: string[];
  };
  message?: string;
};
