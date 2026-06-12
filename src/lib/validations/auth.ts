import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export type RegisterFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type ForgotPasswordFormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
  success?: boolean;
};

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/\d/, { message: 'Password must contain a number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain a special character.' })
    .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter.' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type ResetPasswordFormState = {
  errors?: {
    token?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
};


