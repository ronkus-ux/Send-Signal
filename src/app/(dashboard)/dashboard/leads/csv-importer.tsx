'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Upload, X } from 'lucide-react';
import { importLeads } from '@/lib/actions/lead';

type Step = 'UPLOAD' | 'MAP' | 'IMPORTING' | 'DONE';

export function CsvImporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('UPLOAD');
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({
    phone_number: '',
    first_name: '',
    last_name: '',
    email: ''
  });
  const [importResult, setImportResult] = useState<{ imported: number, failed: number } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
          setData(results.data as Record<string, any>[]);
          
          // Auto-guess mapping
          const newMap = { ...mapping };
          results.meta.fields.forEach(field => {
            const lower = field.toLowerCase();
            if (lower.includes('phone') || lower.includes('number')) newMap.phone_number = field;
            if (lower.includes('first') || lower === 'name') newMap.first_name = field;
            if (lower.includes('last')) newMap.last_name = field;
            if (lower.includes('email')) newMap.email = field;
          });
          setMapping(newMap);
          setStep('MAP');
        }
      }
    });
  };

  const executeImport = async () => {
    if (!mapping.phone_number) {
      alert("You must map a column to Phone Number");
      return;
    }

    setStep('IMPORTING');

    const mappedLeads = data.map(row => ({
      phone_number: row[mapping.phone_number],
      first_name: mapping.first_name ? row[mapping.first_name] : undefined,
      last_name: mapping.last_name ? row[mapping.last_name] : undefined,
      email: mapping.email ? row[mapping.email] : undefined,
    })).filter(lead => !!lead.phone_number);

    try {
      const result = await importLeads(mappedLeads);
      setImportResult(result);
      setStep('DONE');
    } catch (error) {
      console.error(error);
      alert("Failed to import leads");
      setStep('MAP');
    }
  };

  const reset = () => {
    setIsOpen(false);
    setStep('UPLOAD');
    setHeaders([]);
    setData([]);
    setImportResult(null);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-white border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] px-4 py-2 text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import CSV
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
          <h3 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Import Leads via CSV</h3>
          <button onClick={reset} className="text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'UPLOAD' && (
            <div className="border-2 border-dashed border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] rounded-lg p-6 text-center hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral60)] mx-auto mb-4" />
              <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)]">Click or drag CSV file to upload</p>
              <p className="text-xs text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-2">Maximum 5MB</p>
            </div>
          )}

          {step === 'MAP' && (
            <div className="space-y-6">
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30)]">
                Map your CSV columns to the required lead fields. Found <strong>{data.length}</strong> rows.
              </p>

              <div className="space-y-4">
                {[
                  { id: 'phone_number', label: 'Phone Number (Required)', required: true },
                  { id: 'first_name', label: 'First Name' },
                  { id: 'last_name', label: 'Last Name' },
                  { id: 'email', label: 'Email' }
                ].map(field => (
                  <div key={field.id} className="flex items-center justify-between gap-4">
                    <label className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] w-1/2">
                      {field.label}
                    </label>
                    <select 
                      value={mapping[field.id]} 
                      onChange={e => setMapping({...mapping, [field.id]: e.target.value})}
                      className="w-1/2 h-10 px-3 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)]"
                    >
                      <option value="">-- Ignore --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
                <button 
                  onClick={() => setStep('UPLOAD')}
                  className="px-4 py-2 text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] hover:text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]"
                >
                  Back
                </button>
                <button 
                  onClick={executeImport}
                  disabled={!mapping.phone_number}
                  className="rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors disabled:opacity-50"
                >
                  Import {data.length} Leads
                </button>
              </div>
            </div>
          )}

          {step === 'IMPORTING' && (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)]">Importing leads into database...</p>
            </div>
          )}

          {step === 'DONE' && (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-base font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-2">Import Complete!</h4>
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mb-6">
                Successfully imported <strong>{importResult?.imported}</strong> leads. 
                {importResult?.failed ? ` Skipped ${importResult.failed} invalid rows.` : ''}
              </p>
              <button 
                onClick={reset}
                className="w-full rounded-md bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
