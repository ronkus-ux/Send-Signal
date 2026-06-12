'use client';

import Link from "next/link";
import { useActionState, useState, useEffect, Suspense } from "react";
import { resetPassword } from "@/lib/actions/auth";
import { Send, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import styles from "./reset-password.module.css";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [state, formAction, isPending] = useActionState(resetPassword, {});

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isPasswordDirty, setIsPasswordDirty] = useState(false);
  const [isConfirmPasswordDirty, setIsConfirmPasswordDirty] = useState(false);

  const [showPasswordValidBg, setShowPasswordValidBg] = useState(false);
  const [showConfirmPasswordValidBg, setShowConfirmPasswordValidBg] = useState(false);

  const getUnmetRequirements = (val: string) => {
    const unmet = [];
    if (val.length < 8) {
      unmet.push('Password must be a minimum of 8 characters');
    }
    if (!/\d/.test(val)) {
      unmet.push('Password must contain a number');
    }
    if (!/[^a-zA-Z0-9]/.test(val)) {
      unmet.push('Password must contain a special character');
    }
    if (!/[A-Z]/.test(val)) {
      unmet.push('Password must contain an uppercase letter');
    }
    return unmet;
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError('This field cannot be empty');
      setShowPasswordValidBg(false);
    } else {
      const unmet = getUnmetRequirements(password);
      if (unmet.length > 0) {
        setPasswordError('Password does not meet all requirements');
        setShowPasswordValidBg(false);
      } else {
        setShowPasswordValidBg(true);
      }
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('This field cannot be empty');
      setShowConfirmPasswordValidBg(false);
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setShowConfirmPasswordValidBg(false);
    } else {
      setShowConfirmPasswordValidBg(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let hasError = false;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password) {
      setPasswordError('Choose a Password');
      setShowPasswordValidBg(false);
      hasError = true;
    } else {
      const unmet = getUnmetRequirements(password);
      if (unmet.length > 0) {
        setPasswordError('Password does not meet all requirements');
        setShowPasswordValidBg(false);
        hasError = true;
      } else {
        setShowPasswordValidBg(true);
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm your Password');
      setShowConfirmPasswordValidBg(false);
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setShowConfirmPasswordValidBg(false);
      hasError = true;
    } else {
      setShowConfirmPasswordValidBg(true);
    }

    if (hasError) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setIsPasswordDirty(false);
      setIsConfirmPasswordDirty(false);
    }
  };

  const displayPasswordError = isPasswordDirty ? passwordError : (passwordError || state.errors?.password?.[0]);
  const displayConfirmPasswordError = isConfirmPasswordDirty ? confirmPasswordError : (confirmPasswordError || state.errors?.confirmPassword?.[0]);

  if (!token) {
    return (
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Invalid Link</h1>
          <p className={styles.loginSubtitle}>
            The password reset link is missing. Please request a new link.
          </p>
        </div>
        <div className={styles.loginForm}>
          <Link href="/forgot-password" className={styles.ctaButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Request Reset Link
          </Link>
        </div>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className={styles.loginCard}>
        <div className={`${styles.loginHeader} ${styles.successHeader}`}>
          <h1 className={styles.loginTitle}>Password updated</h1>
          <p className={styles.loginSubtitle}>
            Your password has been successfully reset.
          </p>
        </div>
        <div className={styles.loginForm}>
          <Link href="/login" className={styles.ctaButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <h1 className={styles.loginTitle}>Reset your password</h1>
        <p className={styles.loginSubtitle}>Enter a secure new password for your account</p>
      </div>

      <form className={styles.loginForm} action={formAction} onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="token" value={token} />

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>New Password</label>
          <div className="relative flex items-center w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordDirty(true);
                setShowPasswordValidBg(false);
                if (e.target.value) setPasswordError('');
              }}
              onBlur={handlePasswordBlur}
              className={`${styles.formInput} pr-10 w-full ${displayPasswordError ? styles.inputError : ''} ${showPasswordValidBg ? styles.inputValid : ''}`}
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
          {password !== '' && getUnmetRequirements(password).length > 0 && (
            <ul className={styles.passwordRequirementsList}>
              {getUnmetRequirements(password).map((req, idx) => (
                <li key={idx} className={styles.passwordRequirementItem}>
                  <span className="text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)]">•</span> {req}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
          <div className="relative flex items-center w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setIsConfirmPasswordDirty(true);
                setShowConfirmPasswordValidBg(false);
                if (e.target.value) setConfirmPasswordError('');
              }}
              onBlur={handleConfirmPasswordBlur}
              className={`${styles.formInput} pr-10 w-full ${displayConfirmPasswordError ? styles.inputError : ''} ${showConfirmPasswordValidBg ? styles.inputValid : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 transition-colors"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {displayConfirmPasswordError && (
            <p className={styles.formError}>{displayConfirmPasswordError}</p>
          )}
        </div>

        {state.message && !state.success && (
          <p className={styles.submitError}>
            {state.message}
          </p>
        )}

        <button type="submit" className={styles.ctaButton} disabled={isPending}>
          {isPending ? 'Updating password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = "Reset Password";
  }, []);

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
          <Suspense fallback={
            <div className={styles.loginCard}>
              <div className={styles.loginHeader}>
                <p className={styles.loginSubtitle}>Loading reset form...</p>
              </div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
