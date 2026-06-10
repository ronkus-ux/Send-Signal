'use client';

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Send } from "lucide-react";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, {});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [showEmailValidBg, setShowEmailValidBg] = useState(false);

  // Set the page title to "Reset Password"
  useEffect(() => {
    document.title = "Reset Password";
  }, []);

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return 'Please enter a valid email address';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('This field cannot be empty');
      setShowEmailValidBg(false);
    } else {
      const err = validateEmail(email);
      setEmailError(err);
      setShowEmailValidBg(err === '');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let hasError = false;
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Enter your Email');
      setShowEmailValidBg(false);
      hasError = true;
    } else {
      const emailErr = validateEmail(email);
      if (emailErr) {
        setEmailError(emailErr);
        setShowEmailValidBg(false);
        hasError = true;
      } else {
        setShowEmailValidBg(true);
      }
    }

    if (hasError) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setIsEmailDirty(false);
    }
  };

  const displayEmailError = isEmailDirty ? emailError : (emailError || state.errors?.email?.[0]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--sys-color-roles-1-primary-roles-on-primary-color-role,#ffffff)]">
      <title>Reset Password</title>
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
              <h1 className={styles.loginTitle}>
                {state.success ? "Check your email" : "Reset password"}
              </h1>
              <p className={styles.loginSubtitle}>
                {state.success ? state.message : "Enter your email to receive a reset link."}
              </p>
            </div>
            
            {state.success ? (
              <div className={styles.loginForm}>
                <Link href="/login" className={styles.ctaButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '16px' }}>
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form className={styles.loginForm} action={formAction} onSubmit={handleSubmit} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Work Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      setIsEmailDirty(true);
                      setShowEmailValidBg(false);
                      setEmailError(validateEmail(val));
                    }}
                    onBlur={handleEmailBlur}
                    className={`${styles.formInput} ${displayEmailError ? styles.inputError : ''} ${showEmailValidBg ? styles.inputValid : ''}`} 
                    required 
                  />
                  {displayEmailError && (
                    <p className={styles.formError}>{displayEmailError}</p>
                  )}
                </div>

                {state.message && !state.success && (
                  <p className={styles.submitError}>
                    {state.message}
                  </p>
                )}
                
                <button type="submit" className={styles.ctaButton} disabled={isPending}>
                  {isPending ? 'Sending link...' : 'Send Reset Link'}
                </button>
              </form>
            )}
            
            {!state.success && (
              <div className={styles.loginFooter}>
                <p>Remember your password? <Link href="/login" className={styles.signupLink}>Sign in</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
