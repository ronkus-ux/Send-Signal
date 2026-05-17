'use client';

import Link from "next/link";
import { useActionState } from "react";
import { loginUser } from "@/lib/actions/auth";
import styles from "./login.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, {});

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Welcome back</h1>
          <p className={styles.loginSubtitle}>Please enter your details to sign in.</p>
        </div>
        
        <form className={styles.loginForm} action={formAction}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input type="email" id="email" name="email" className={styles.formInput} placeholder="Enter your email" required />
            {state.errors?.email && (
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)]">{state.errors.email[0]}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input type="password" id="password" name="password" className={styles.formInput} placeholder="••••••••" required />
            {state.errors?.password && (
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)]">{state.errors.password[0]}</p>
            )}
          </div>
          
          <div className={styles.formOptions}>
            <label className={styles.rememberMe}>
              <input type="checkbox" className={styles.checkboxInput} />
              <span className={styles.checkboxLabel}>Remember for 30 days</span>
            </label>
            <Link href="#" className={styles.forgotPassword}>Forgot password?</Link>
          </div>

          {state.message && (
            <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] text-center">
              {state.message}
            </p>
          )}
          
          <button type="submit" className={styles.ctaButton} disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className={styles.loginFooter}>
          <p>Don&apos;t have an account? <Link href="/register" className={styles.signupLink}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
