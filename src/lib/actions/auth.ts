'use server';

import { redirect } from 'next/navigation';
import { prisma } from '../prisma';
import { hashPassword, verifyPassword } from '../auth/crypto';
import { createSession, deleteSession } from '../auth/session';
import { LoginSchema, LoginFormState, RegisterSchema, RegisterFormState } from '../validations/auth';

export async function registerUser(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'Email is already in use.',
      };
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        company_name: name,
        email,
        password_hash: hashedPassword,
      },
    });

    await createSession(user.id);
  } catch {
    return {
      message: 'An error occurred during registration. Please try again.',
    };
  }
  
  redirect('/dashboard');
}

export async function loginUser(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.is_active) {
      return {
        message: 'Invalid email or password.',
      };
    }

    const passwordsMatch = verifyPassword(password, user.password_hash);

    if (!passwordsMatch) {
      return {
        message: 'Invalid email or password.',
      };
    }

    await createSession(user.id);
  } catch {
    return {
      message: 'An error occurred during sign in. Please try again.',
    };
  }

  redirect('/dashboard');
}

export async function logoutUser() {
  await deleteSession();
  redirect('/login');
}
