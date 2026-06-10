import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import OnboardingWizardClient from './onboarding-wizard-client';

export default async function OnboardingPage() {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  const user = {
    id: session.user.id,
    company_name: session.user.company_name,
    email: session.user.email,
  };

  return <OnboardingWizardClient user={user} />;
}
