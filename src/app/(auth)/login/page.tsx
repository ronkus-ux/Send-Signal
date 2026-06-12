'use client';

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginUser } from "@/lib/actions/auth";
import { Send, Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, {});
  const [showPassword, setShowPassword] = useState(false);

  // Set the page title to "Sign In"
  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const displayEmailError = state.errors?.email?.[0];
  const displayPasswordError = state.errors?.password?.[0];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--sys-color-roles-1-primary-roles-on-primary-color-role,#ffffff)]">
      <title>Sign In</title>
      {/* Header from landing page with only the logo centered horizontally and vertically, and no bottom border */}
      <header className="w-full bg-[var(--sys-color-roles-1-primary-roles-on-primary-color-role,#ffffff)] px-2 md:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-14 items-center justify-center">
            <Link href="/" className="flex items-center gap-1 group no-underline">
              <div className="flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
                <Send size={20} strokeWidth={2} className="text-brand-primary transform -rotate-12" />
              </div>
              <span className="title-medium text-brand-neutral-10">
                Send Signal
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Centered Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <h1 className={styles.loginTitle}>Sign In</h1>
              <p className={styles.loginSubtitle}>Welcome back to Send Signal</p>
            </div>
            
            <form className={styles.loginForm} action={formAction} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Work Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className={`${styles.formInput} ${displayEmailError ? styles.inputError : ''}`} 
                  required 
                />
                {displayEmailError && (
                  <p className={styles.formError}>{displayEmailError}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <div className={styles.formLabelRow}>
                  <label htmlFor="password" className={styles.formLabel}>Password</label>
                  <Link href="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
                </div>
                <div className="relative flex items-center w-full">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    className={`${styles.formInput} pr-10 w-full ${displayPasswordError ? styles.inputError : ''}`} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {displayPasswordError && (
                  <p className={styles.formError}>{displayPasswordError}</p>
                )}
              </div>

              {state.message && (
                <p className={styles.submitError}>
                  {state.message}
                </p>
              )}
              
              <button type="submit" className={styles.ctaButton} disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className={styles.loginFooter}>
              <p>Don&apos;t have an account? <Link href="/register" className={styles.signupLink}>Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
