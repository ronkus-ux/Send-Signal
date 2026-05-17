'use client';

import Link from "next/link";
import { useActionState } from "react";
import { registerUser } from "@/lib/actions/auth";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, {});

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Create an account</h1>
          <p className={styles.loginSubtitle}>Please enter your details to get started.</p>
        </div>
        
        <form className={styles.loginForm} action={formAction}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Full Name or Company</label>
            <input type="text" id="name" name="name" className={styles.formInput} placeholder="Enter your name" required />
            {state.errors?.name && (
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)]">{state.errors.name[0]}</p>
            )}
          </div>

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

          {state.message && (
            <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] text-center">
              {state.message}
            </p>
          )}
          
          <button type="submit" className={styles.ctaButton} disabled={isPending}>
            {isPending ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        
        <div className={styles.loginFooter}>
          <p>Already have an account? <Link href="/login" className={styles.signupLink}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
