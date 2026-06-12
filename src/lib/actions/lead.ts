'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { getSession } from '../auth/session';
import { LeadSchema, LeadFormState } from '../validations/lead';

export async function addLead(
  state: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const session = await getSession();
  if (!session || !session.user) {
    return { message: 'Unauthorized' };
  }

  const validatedFields = LeadSchema.safeParse({
    phone_number: formData.get('phone_number'),
    first_name: formData.get('first_name') || null,
    last_name: formData.get('last_name') || null,
    email: formData.get('email') || null,
    opt_in: formData.get('opt_in') === 'on' || formData.get('opt_in') === 'true',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    await prisma.lead.upsert({
      where: {
        user_id_phone_number: {
          user_id: session.user.id,
          phone_number: data.phone_number,
        }
      },
      update: {
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        email: data.email || undefined,
        opt_in: data.opt_in,
      },
      create: {
        user_id: session.user.id,
        phone_number: data.phone_number,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        opt_in: data.opt_in,
        status: 'NEW',
      }
    });

    revalidatePath('/dashboard');
    return { message: 'SUCCESS' };
  } catch (err) {
    console.error('Failed to add lead:', err);
    return { message: 'An internal error occurred. Please try again later.' };
  }
}

export async function importLeads(leads: Record<string, unknown>[]) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const validLeads = [];
  
  for (const lead of leads) {
    const parsed = LeadSchema.safeParse({
      phone_number: lead.phone_number,
      first_name: lead.first_name || null,
      last_name: lead.last_name || null,
      email: lead.email || null,
      opt_in: true,
    });

    if (parsed.success) {
      validLeads.push({
        user_id: session.user.id,
        phone_number: parsed.data.phone_number,
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        email: parsed.data.email,
        opt_in: parsed.data.opt_in,
        status: 'NEW' as const,
      });
    }
  }

  if (validLeads.length > 0) {
    await prisma.lead.createMany({
      data: validLeads,
      skipDuplicates: true,
    });
    
    revalidatePath('/dashboard');
  }

  return { 
    success: true, 
    imported: validLeads.length, 
    failed: leads.length - validLeads.length 
  };
}

export async function deleteLead(leadId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  await prisma.lead.deleteMany({
    where: { 
      id: leadId,
      user_id: session.user.id
    }
  });

  revalidatePath('/dashboard');
}
