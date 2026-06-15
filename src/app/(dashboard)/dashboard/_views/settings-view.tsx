'use client';

import React, { useEffect, useState } from 'react';
import { fetchSettingsData, updateProfileSettings } from '@/lib/actions/dashboard';
import { ConnectWhatsappForm } from '../settings/client-form';
import { WhatsappAccountList } from '../settings/account-list';

type SettingsData = {
  company_name: string;
  email: string;
  accounts: any[];
};

export function SettingsView() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [isConnecting, setIsConnecting] = useState(false);

  const loadData = () => {
    fetchSettingsData().then(fetchedData => {
      setData(fetchedData);
      setEditCompanyName(fetchedData.company_name);
      setEditEmail(fetchedData.email);
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    if (data) {
      setEditCompanyName(data.company_name);
      setEditEmail(data.email);
    }
  };

  const handleSave = async () => {
    if (!editCompanyName.trim()) {
      setError('Company Name cannot be empty');
      return;
    }
    if (!editEmail.trim()) {
      setError('Email Address cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const res = await updateProfileSettings({ company_name: editCompanyName, email: editEmail });
      if (res.success) {
        setIsEditing(false);
        loadData();
      } else {
        setError(res.error || 'Failed to update profile settings');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="title-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Settings</h1>
          <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mt-1">Configure your company profile and connect WhatsApp accounts.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        
        {/* Profile Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">Profile Settings</h2>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-md bg-white border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] transition-colors label-large cursor-pointer shadow-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-md transition-colors label-large cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-md transition-colors label-large cursor-pointer shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Company Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  disabled={isSaving}
                  className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]"
                />
              ) : (
                <div className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                  {data.company_name}
                </div>
              )}
            </div>
            <div>
              <label className="block label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={isSaving}
                  className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80)] bg-white text-sm outline-none focus:border-[var(--sys-color-roles-1-primary-roles-primary-color-role)] text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]"
                />
              ) : (
                <div className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] label-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                  {data.email}
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-error-error50)] mt-3">{error}</p>}
        </div>

        {/* WhatsApp Accounts Section */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="title-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-1">WhatsApp Accounts</h2>
              <p className="body-large text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)]">Connect and manage your WhatsApp Business API credentials.</p>
            </div>
            {!isConnecting && (
              <button
                onClick={() => setIsConnecting(true)}
                className="px-4 py-2 bg-[var(--sys-color-roles-1-primary-roles-primary-color-role)] hover:bg-[var(--sys-primitive-color-collection-1-color-palettes-primary-primary60)] text-white rounded-md transition-colors label-large cursor-pointer shadow-sm"
              >
                Connect Account
              </button>
            )}
          </div>

          {isConnecting && (
            <ConnectWhatsappForm 
              onSuccess={() => {
                setIsConnecting(false);
                loadData();
              }}
              onCancel={() => setIsConnecting(false)}
            />
          )}

          <WhatsappAccountList accounts={data.accounts} onSuccess={loadData} />
        </div>

      </div>
    </div>
  );
}
