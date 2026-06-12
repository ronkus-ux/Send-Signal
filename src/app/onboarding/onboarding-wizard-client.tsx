'use client';

import { useState, Fragment, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Send, Upload, X, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { connectWhatsappAccount } from '@/lib/actions/whatsapp';
import { importLeads } from '@/lib/actions/lead';
import styles from './onboarding.module.css';

interface UserProps {
  id: string;
  company_name: string;
  email: string;
}

export default function OnboardingWizardClient({ user }: { user: UserProps }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showAccessToken, setShowAccessToken] = useState(false);

  useEffect(() => {
    if (step === 4) {
      // Direct center burst
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      // Side cannon confetti stream for 1.5 seconds
      const duration = 1.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 }
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [step]);

  // Step 2: WhatsApp Connection State
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [waErrors, setWaErrors] = useState<Record<string, string[]>>({});
  const [waMessage, setWaMessage] = useState('');
  const [isWaPending, setIsWaPending] = useState(false);

  const showSkip = !phoneNumberId.trim() && !accessToken.trim();

  // Step 3: CSV Lead Import State
  const [csvStep, setCsvStep] = useState<'UPLOAD' | 'UPLOADING' | 'MAP' | 'IMPORTING' | 'DONE'>('UPLOAD');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Record<string, any>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    phone_number: '',
    first_name: '',
    last_name: '',
    email: ''
  });
  const [importResult, setImportResult] = useState<{ imported: number, failed: number } | null>(null);

  // WhatsApp Connect submit handler
  const handleConnectWhatsapp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaErrors({});
    setWaMessage('');
    setIsWaPending(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await connectWhatsappAccount({}, formData);
      if (result.errors) {
        setWaErrors(result.errors);
      } else if (result.message === 'SUCCESS') {
        setStep(3); // Proceed to Step 3
      } else if (result.message) {
        setWaMessage(result.message);
      }
    } catch (error) {
      console.error(error);
      setWaMessage('An error occurred. Please try again.');
    } finally {
      setIsWaPending(false);
    }
  };

  // CSV file parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setCsvStep('UPLOADING');
    setUploadProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          const parsedHeaders = results.meta.fields;
          const parsedData = results.data as Record<string, any>[];
          
          // Auto-guess mapping
          const newMap = {
            phone_number: '',
            first_name: '',
            last_name: '',
            email: ''
          };
          parsedHeaders.forEach(field => {
            const lower = field.toLowerCase();
            if (
              lower.includes('phone') || 
              lower.includes('number') || 
              lower.includes('mobile') || 
              lower.includes('tel') || 
              lower.includes('contact')
            ) {
              newMap.phone_number = field;
            }
            if (lower.includes('first') || lower === 'name') newMap.first_name = field;
            if (lower.includes('last')) newMap.last_name = field;
            if (lower.includes('email')) newMap.email = field;
          });

          // Fallback if no phone number column is detected: use the first column
          if (!newMap.phone_number && parsedHeaders.length > 0) {
            newMap.phone_number = parsedHeaders[0];
          }

          // Simulate progress animation
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
              clearInterval(interval);
              setUploadProgress(100);
              setTimeout(() => {
                setHeaders(parsedHeaders);
                setCsvData(parsedData);
                setMapping(newMap);
                setCsvStep('MAP');
              }, 300);
            } else {
              setUploadProgress(progress);
            }
          }, 100);
        }
      }
    });
  };

  const handleRemoveFile = () => {
    setFileName('');
    setCsvStep('UPLOAD');
    setHeaders([]);
    setCsvData([]);
    setUploadProgress(0);
    setMapping({
      phone_number: '',
      first_name: '',
      last_name: '',
      email: ''
    });
  };

  // CSV Lead Import Execution
  const executeImport = async () => {
    if (!mapping.phone_number) {
      alert("You must map a column to Phone Number");
      return;
    }

    setCsvStep('IMPORTING');

    const mappedLeads = csvData.map(row => {
      const rawPhone = row[mapping.phone_number];
      const phone = rawPhone ? String(rawPhone).replace(/[\s\-\(\)\.]/g, '') : '';
      return {
        phone_number: phone,
        first_name: mapping.first_name ? String(row[mapping.first_name] ?? '') : undefined,
        last_name: mapping.last_name ? String(row[mapping.last_name] ?? '') : undefined,
        email: mapping.email ? String(row[mapping.email] ?? '') : undefined,
      };
    }).filter(lead => !!lead.phone_number);

    try {
      const result = await importLeads(mappedLeads);
      setImportResult(result);
      setCsvStep('DONE');
    } catch (error) {
      console.error(error);
      alert("Failed to import leads");
      setCsvStep('MAP');
    }
  };

  // Proceed to dashboard on onboarding completion
  const handleCompleteOnboarding = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      {/* Header from landing page with only the logo centered horizontally and vertically, and no bottom border */}
      <header className="w-full bg-[var(--sys-color-roles-1-primary-roles-on-primary-color-role,#ffffff)] px-2 md:px-24 mb-8">
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

      <div className="flex-1 flex items-center justify-center p-6">
      <div className={styles.card}>
        
        {/* Onboarding Header */}
        <h1 className={styles.title}>Welcome to Send Signal</h1>

        {/* Steps Indicators */}
        <div className={styles.stepsContainer}>
          <div className={styles.stepsRow}>
            {[1, 2, 3, 4].map((s) => (
              <Fragment key={s}>
                <div 
                  className={`${styles.stepNumber} ${step === s ? styles.stepNumberActive : ''} ${step > s ? styles.stepNumberCompleted : ''}`}
                >
                  {step > s ? <Check size={12} strokeWidth={3} /> : s}
                </div>
                {s < 4 && (
                  <div 
                    className={`${styles.stepLine} ${step > s ? styles.stepLineActive : ''}`}
                  />
                )}
              </Fragment>
            ))}
          </div>
          <span className={styles.stepLabel}>Step {step} of 4</span>
        </div>

        {/* Dynamic Step Content */}
        <div className={styles.contentArea}>
          
          {/* STEP 1: Welcome & Setup Explanation */}
          {step === 1 && (
            <div>
              <h2 className={styles.subtitle}>Let's get you set up</h2>
              <p className={styles.description}>
                Send Signal helps you automate personalized WhatsApp outreach campaigns. We'll guide you through connecting your account, importing leads, and setting up your first message template.
              </p>
            </div>
          )}

          {/* STEP 2: Connect WhatsApp Account */}
          {step === 2 && (
            <div>
              <h2 className={styles.subtitle}>Connect your WhatsApp Business Account</h2>
              <p className={styles.description} style={{ marginBottom: 0 }}>
                To send messages, you need to connect your WhatsApp Business Account. For this setup, we'll mock the connection.
              </p>

              <form id="whatsappForm" onSubmit={handleConnectWhatsapp} className="space-y-4 mt-3">
                <input type="hidden" name="account_name" value="Mock Account" />
                <input type="hidden" name="business_account_id" value="123456789012345" />
                <input type="hidden" name="display_phone_number" value="+1 (555) 000-0000" />

                <div className={styles.formGroup}>
                  <label htmlFor="phone_number_id" className={styles.formLabel}>WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    id="phone_number_id"
                    name="phone_number_id"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    placeholder="e.g. 102456789012345"
                    className={styles.formInput}
                    required
                  />
                  {waErrors.phone_number_id && <p className={styles.formError}>{waErrors.phone_number_id[0]}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="access_token" className={styles.formLabel}>System User Access Token</label>
                  <div className="relative flex items-center w-full">
                    <input
                      type={showAccessToken ? "text" : "password"}
                      id="access_token"
                      name="access_token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="EAABw..."
                      className={`${styles.formInput} pr-10 w-full`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccessToken(!showAccessToken)}
                      className="absolute right-3 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 transition-colors"
                      title={showAccessToken ? "Hide access token" : "Show access token"}
                    >
                      {showAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {waErrors.access_token && <p className={styles.formError}>{waErrors.access_token[0]}</p>}
                </div>

                {waMessage && <p className="text-sm text-red-500 font-medium text-center">{waMessage}</p>}
              </form>
            </div>
          )}

          {/* STEP 3: CSV Lead Import */}
          {step === 3 && (
            <div>
              <h2 className={styles.subtitle}>Import your first leads</h2>
              <p className={styles.description}>
                Upload a CSV file with your leads. We'll import them automatically.
              </p>

              {csvStep === 'UPLOAD' && (
                <div className={styles.csvContainer}>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    className={styles.fileInput}
                  />
                  <Upload className={styles.csvIcon} />
                  <p className={styles.csvTitle}>Click or drag CSV file to upload</p>
                  <p className={styles.csvSubtitle}>Maximum 5MB</p>
                </div>
              )}

              {csvStep === 'UPLOADING' && (
                <div className={styles.csvContainerUploading}>
                  <p className={styles.uploadingText}>Uploading...</p>
                  <div className={styles.progressBarContainer}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className={styles.progressPercent}>{uploadProgress}%</p>
                </div>
              )}

              {csvStep === 'MAP' && (
                <div className="space-y-6">
                  <div className={styles.csvContainerUploaded}>
                    <span 
                      className="text-sm font-semibold text-[var(--sys-color-roles-1-primary-roles-on-primary-conainer-color-role)] truncate max-w-[280px] sm:max-w-[360px]"
                      title={fileName || 'Uploaded CSV File'}
                    >
                      {fileName || 'Uploaded CSV File'}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="inline-flex items-center justify-center text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50/50 cursor-pointer"
                      aria-label="Remove uploaded file"
                      title="Delete CSV"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">
                    Found <strong>{csvData.length}</strong> rows. Ready to import leads.
                  </p>
                </div>
              )}

              {csvStep === 'IMPORTING' && (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)]">Importing leads into database...</p>
                </div>
              )}

              {csvStep === 'DONE' && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-2">Import Complete!</h4>
                  <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mb-6">
                    Successfully imported <strong>{importResult?.imported}</strong> leads. 
                    {importResult?.failed ? ` Skipped ${importResult.failed} invalid rows.` : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Orientation / Summary */}
          {step === 4 && (
            <div>
              <h2 className={styles.subtitle}>You're all set!</h2>
              {importResult ? (
                <>
                  <p className={styles.description}>
                    Onboarding is now complete. You have connected your account, loaded your leads database, and are ready to construct your first outreach template.
                  </p>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Onboarding Checklist Summary:</h4>
                    <ul className="text-xs text-blue-800 space-y-1.5 list-disc pl-4">
                      <li>User Account Setup: <strong>Completed</strong></li>
                      <li>WhatsApp Cloud API Integration: <strong>Setup</strong></li>
                      <li>Leads Database Synchronization: <strong>Done</strong></li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.description}>
                    Your account is configured. Let's go to the dashboard to create your first template and launch a campaign.
                  </p>
                  <p className={styles.description}>
                    You can add leads later from the dashboard.
                  </p>
                </>
              )}
            </div>
          )}

        </div>

        {/* Footer / Wizard Actions */}
        {/* Only display Back/Next buttons for normal navigation steps */}
        {!(step === 3 && (csvStep === 'IMPORTING' || csvStep === 'UPLOADING')) && (
          <div className={styles.actionsRow}>
            
            {/* Back Button */}
            <button 
              onClick={() => {
                if (step === 3 && csvStep === 'DONE') {
                  setCsvStep('MAP');
                } else if (step > 1) {
                  setStep((s) => (s - 1) as any);
                }
              }}
              disabled={step === 1}
              className={`${styles.backBtn} ${step > 1 ? styles.backBtnActive : ''}`}
              style={step === 1 ? { visibility: 'hidden' } : undefined}
            >
              Back
            </button>

            {/* Next Button */}
            {step < 4 ? (
              step === 2 ? (
                showSkip ? (
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    className={styles.nextBtn}
                  >
                    Skip
                  </button>
                ) : (
                  // Step 2 uses submit button for form
                  <button 
                    type="submit" 
                    form="whatsappForm"
                    disabled={isWaPending}
                    className={styles.nextBtn}
                  >
                    {isWaPending ? 'Connecting...' : (
                      <>
                        Next <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )
              ) : step === 3 ? (
                csvStep === 'UPLOAD' ? (
                  <button 
                    type="button" 
                    onClick={() => setStep(4)}
                    className={styles.nextBtn}
                  >
                    Skip
                  </button>
                ) : csvStep === 'DONE' ? (
                  <button 
                    type="button" 
                    onClick={() => setStep(4)}
                    className={styles.nextBtn}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={executeImport}
                    disabled={!mapping.phone_number}
                    className={styles.nextBtn}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                )
              ) : (
                <button 
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className={styles.nextBtn}
                >
                  Next <ArrowRight size={16} />
                </button>
              )
            ) : (
              // Step 4 final Complete Button
              <button 
                onClick={handleCompleteOnboarding}
                className={styles.nextBtn}
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            )}

          </div>
        )}

      </div>
      </div>
      
      {/* Small design circle in bottom-left to match screenshot context */}
      <div className={styles.logoCorner}>
        <div className="w-8 h-8 rounded-full bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] flex items-center justify-center text-white text-[12px] font-bold">
          N
        </div>
      </div>
    </div>
  );
}
