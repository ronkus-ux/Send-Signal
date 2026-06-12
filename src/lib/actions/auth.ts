'use server';

import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { prisma } from '../prisma';
import { hashPassword, verifyPassword } from '../auth/crypto';
import { createSession, deleteSession } from '../auth/session';
import {
  LoginSchema,
  LoginFormState,
  RegisterSchema,
  RegisterFormState,
  ForgotPasswordSchema,
  ForgotPasswordFormState,
  ResetPasswordSchema,
  ResetPasswordFormState,
} from '../validations/auth';
import { sendPasswordResetEmail } from '../email';

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
      // Return a general success message to prevent user enumeration
      return {
        success: true,
        message: 'If an account exists with that email, we have sent a password reset link.',
      };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const reset_token_hash = crypto.createHash('sha256').update(token).digest('hex');
    const reset_token_expires_at = new Date(Date.now() + 3600000); // 1 hour

    // Update user record with token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token_hash,
        reset_token_expires_at,
      },
    });

    // Send reset email via SMTP
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return {
      success: true,
      message: 'If an account exists with that email, we have sent a password reset link.',
    };
  } catch (error) {
    console.error("PASSWORD RESET REQUEST ERROR DETAIL:", error);
    return {
      message: 'An error occurred. Please try again.',
    };
  }
}

export async function resetPassword(
  state: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const validatedFields = ResetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { token, password } = validatedFields.data;

  try {
    const reset_token_hash = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user with valid token
    const user = await prisma.user.findFirst({
      where: {
        reset_token_hash,
        reset_token_expires_at: {
          gt: new Date(),
        },
      },
    });

    if (!user || !user.is_active) {
      return {
        message: 'Invalid or expired password reset link.',
      };
    }

    // Hash the new password using the established helper
    const hashedPassword = hashPassword(password);

    // Update password and invalidate the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token_hash: null,
        reset_token_expires_at: null,
      },
    });

    return {
      success: true,
      message: 'Your password has been successfully reset.',
    };
  } catch (error) {
    console.error("PASSWORD RESET ERROR DETAIL:", error);
    return {
      message: 'An error occurred during password reset. Please try again.',
    };
  }
}


