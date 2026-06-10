'use client';

import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { registerUser } from "@/lib/actions/auth";
import { Send, Eye, EyeOff } from "lucide-react";
import styles from "./register.module.css";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, {});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isNameDirty, setIsNameDirty] = useState(false);
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [isPasswordDirty, setIsPasswordDirty] = useState(false);

  const [showNameValidBg, setShowNameValidBg] = useState(false);
  const [showEmailValidBg, setShowEmailValidBg] = useState(false);
  const [showPasswordValidBg, setShowPasswordValidBg] = useState(false);

  // Set the page title to "Create Account"
  useEffect(() => {
    document.title = "Create Account";
  }, []);

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return 'Please enter a valid company email address';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid company email address';
    }
    const lowerVal = val.toLowerCase().trim();
    if (lowerVal.endsWith('gmail.com') || lowerVal.endsWith('yahoo.com')) {
      return 'This is not a valid company email address';
    }
    return '';
  };

  const handleNameBlur = () => {
    if (!name.trim()) {
      setNameError('This field cannot be empty');
      setShowNameValidBg(false);
    } else {
      setShowNameValidBg(true);
    }
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let hasError = false;

    // Reset error states
    setNameError('');
    setEmailError('');
    setPasswordError('');

    if (!name.trim()) {
      setNameError('Enter your Company Name');
      setShowNameValidBg(false);
      hasError = true;
    } else {
      setShowNameValidBg(true);
    }

    if (!email.trim()) {
      setEmailError('Enter your Company Email');
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

    if (hasError) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setIsNameDirty(false);
      setIsEmailDirty(false);
      setIsPasswordDirty(false);
    }
  };

  const displayNameError = isNameDirty ? nameError : (nameError || state.errors?.name?.[0]);
  const displayEmailError = isEmailDirty ? emailError : (emailError || state.errors?.email?.[0]);
  const displayPasswordError = isPasswordDirty ? passwordError : (passwordError || state.errors?.password?.[0]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--sys-color-roles-1-primary-roles-on-primary-color-role,#ffffff)]">
      <title>Create Account</title>
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
              <h1 className={styles.loginTitle}>Create Account</h1>
              <p className={styles.loginSubtitle}>Get started with Send Signal</p>
            </div>
            
            <form className={styles.loginForm} action={formAction} onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>Company Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsNameDirty(true);
                    setShowNameValidBg(false);
                    if (e.target.value.trim()) setNameError('');
                  }}
                  onBlur={handleNameBlur}
                  className={`${styles.formInput} ${displayNameError ? styles.inputError : ''} ${showNameValidBg ? styles.inputValid : ''}`} 
                />
                {displayNameError && (
                  <p className={styles.formError}>{displayNameError}</p>
                )}
              </div>

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
                />
                {displayEmailError && (
                  <p className={styles.formError}>{displayEmailError}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Password</label>
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

              {state.message && (
                <p className={styles.submitError}>
                  {state.message}
                </p>
              )}
              
              <button type="submit" className={styles.ctaButton} disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            
            <div className={styles.loginFooter}>
              <p>Already have an account? <Link href="/login" className={styles.signupLink}>Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
