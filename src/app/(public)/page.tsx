import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-brand-neutral-99 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl relative z-10 text-center flex flex-col justify-center items-center">
          <h1 className="display-large text-brand-neutral-10 max-w-4xl mx-auto mb-8">
            Automate Personalized <br className="hidden sm:block" />
            WhatsApp Outreach
          </h1>
          
          <p className="body-large text-brand-neutral-30 max-w-2xl mx-auto mb-6">
            Turn social media leads into warm conversations instantly. Connect your WhatsApp Business API, import contacts, and launch high-converting outreach campaigns at scale.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center justify-center w-full sm:w-auto rounded bg-brand-primary px-8 py-2.5 label-large text-brand-on-primary shadow-sm hover:bg-brand-primary-60 transition-colors no-underline"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
