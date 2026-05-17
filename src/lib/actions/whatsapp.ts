'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { getSession } from '../auth/session';
import { encryptText } from '../auth/crypto';
import { ConnectWhatsappSchema, ConnectWhatsappFormState } from '../validations/whatsapp';

export async function connectWhatsappAccount(
  state: ConnectWhatsappFormState,
  formData: FormData
): Promise<ConnectWhatsappFormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: 'Unauthorized' };
  }

  const validatedFields = ConnectWhatsappSchema.safeParse({
    account_name: formData.get('account_name'),
    phone_number_id: formData.get('phone_number_id'),
    business_account_id: formData.get('business_account_id'),
    access_token: formData.get('access_token'),
    webhook_verify_token: formData.get('webhook_verify_token'),
    display_phone_number: formData.get('display_phone_number'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const existing = await prisma.whatsappAccount.findUnique({
      where: { phone_number_id: data.phone_number_id }
    });

    if (existing) {
      return { message: 'This WhatsApp Phone Number ID is already connected.' };
    }

    const encryptedAccessToken = encryptText(data.access_token);
    const encryptedWebhookToken = encryptText(data.webhook_verify_token);

    await prisma.whatsappAccount.create({
      data: {
        user_id: session.user.id,
        account_name: data.account_name,
        phone_number_id: data.phone_number_id,
        business_account_id: data.business_account_id,
        display_phone_number: data.display_phone_number,
        access_token_encrypted: encryptedAccessToken,
        webhook_verify_token_encrypted: encryptedWebhookToken,
      }
    });

    revalidatePath('/dashboard/settings');
    return { message: 'SUCCESS' };
  } catch (error) {
    console.error('Failed to connect WhatsApp account:', error);
    return { message: 'An internal error occurred. Please try again later.' };
  }
}

export async function deleteWhatsappAccount(accountId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const account = await prisma.whatsappAccount.findUnique({
    where: { id: accountId }
  });

  if (!account || account.user_id !== session.user.id) {
    throw new Error('Account not found or unauthorized');
  }

  await prisma.whatsappAccount.delete({
    where: { id: accountId }
  });

  revalidatePath('/dashboard/settings');
}
