'use server';

import { redirect } from 'next/navigation';
import { prisma } from '../prisma';
import { hashPassword, verifyPassword } from '../auth/crypto';
import { createSession, deleteSession } from '../auth/session';
import { LoginSchema, LoginFormState, RegisterSchema, RegisterFormState, ForgotPasswordSchema, ForgotPasswordFormState } from '../validations/auth';

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
  } catch (error) {
    console.error("REGISTRATION ERROR DETAIL:", error);
    return {
      message: 'An error occurred during registration. Please try again.',
    };
  }
  
  redirect('/onboarding');
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
  let hasWhatsapp = false;

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

    const count = await prisma.whatsappAccount.count({
      where: { user_id: user.id }
    });
    hasWhatsapp = count > 0;

    await createSession(user.id);
  } catch (error) {
    console.error("LOGIN ERROR DETAIL:", error);
    return {
      message: 'An error occurred during sign in. Please try again.',
    };
  }

  if (hasWhatsapp) {
    redirect('/dashboard');
  } else {
    redirect('/onboarding');
  }
}

export async function logoutUser() {
  await deleteSession();
  redirect('/login');
}

export async function requestPasswordReset(
  state: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.is_active) {
      // Return a general success message to prevent user enumeration, but for simulated usability, we can just say success.
      return {
        success: true,
        message: 'If an account exists with that email, we have sent password reset instructions.',
      };
    }

    // In a real application, you would generate a token, save it to the DB, and send an email.
    // For this implementation, we will log it and return success.
    console.log(`Password reset requested for email: ${email}`);

    return {
      success: true,
      message: 'If an account exists with that email, we have sent password reset instructions.',
    };
  } catch (error) {
    console.error("PASSWORD RESET REQUEST ERROR DETAIL:", error);
    return {
      message: 'An error occurred. Please try again.',
    };
  }
}

