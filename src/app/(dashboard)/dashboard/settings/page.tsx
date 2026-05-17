import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { ConnectWhatsappForm } from './client-form';
import { WhatsappAccountList } from './account-list';

export default async function SettingsPage() {
  const session = await getSession();
  
  // We know session exists because of middleware
  const accounts = await prisma.whatsappAccount.findMany({
    where: { user_id: session!.user.id },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] tracking-tight mb-6">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] divide-y divide-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)]">
        
        {/* Profile Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-4">Profile Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Company Name</label>
              <div className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                {session?.user.company_name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40)] mb-1">Email Address</label>
              <div className="w-full h-10 px-3 py-2 rounded-md border border-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90)] bg-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98)] text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)]">
                {session?.user.email}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Accounts Section */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10)] mb-1">WhatsApp Accounts</h2>
              <p className="text-sm text-[var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50)] mb-4">Connect and manage your WhatsApp Business API credentials.</p>
            </div>
            <ConnectWhatsappForm />
          </div>

          <WhatsappAccountList accounts={accounts} />
        </div>

      </div>
    </div>
  );
}
