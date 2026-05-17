/**
 * WhatsApp Cloud API client
 * Handles outbound message dispatch via Meta's Graph API.
 * Credentials are never logged or stored in plain text.
 */

const BASE_URL = 'https://graph.facebook.com';
const API_VERSION = process.env.WHATSAPP_API_VERSION ?? 'v20.0';

export type SendResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendTextMessage(
  phoneNumberId: string,
  accessToken: string,
  toPhoneNumber: string,
  body: string
): Promise<SendResult> {
  const url = `${BASE_URL}/${API_VERSION}/${phoneNumberId}/messages`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message ?? `HTTP ${res.status}`;
      return { success: false, error: errMsg };
    }

    const messageId: string = data?.messages?.[0]?.id ?? '';
    return { success: true, messageId };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message ?? 'Network error' };
  }
}

/** Simple sleep helper for rate-limiting between batches */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
