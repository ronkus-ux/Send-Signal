import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Users, BarChart3, MessageSquare, Upload, Rocket } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-neutral-99">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--sys-color-roles-1-primary-roles-primary-color-role) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-primary-95 text-brand-primary-30 text-sm font-medium mb-8 border border-brand-primary-90">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
            WhatsApp Business API Ready
          </div>
          
          <h1 className="text-[var(--sys-typography-display-display-large-font-size)] font-[var(--sys-typography-display-display-large-font-weight)] tracking-[var(--sys-typography-display-display-large-letter-spacing)] leading-[1.1] text-brand-neutral-10 max-w-4xl mx-auto mb-8">
            Automate personalized <br className="hidden sm:block" />
            <span className="text-brand-primary">WhatsApp outreach</span>
          </h1>
          
          <p className="text-[var(--sys-typography-body-body-large-font-size)] lg:text-[var(--sys-typography-title-title-large-font-size)] text-brand-neutral-40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Import leads, use dynamic templates, and send targeted messages at scale. Track replies and grow your business with confident, compliant automation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-brand-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-primary-80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Start for free <ArrowRight size={20} />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-neutral-20 shadow-sm border border-brand-neutral-90 hover:bg-brand-neutral-98 transition-colors duration-300"
            >
              View features
            </Link>
          </div>
          
          {/* Dashboard Preview mockup */}
          <div className="mt-20 mx-auto max-w-5xl rounded-2xl border border-brand-neutral-90 bg-white/50 backdrop-blur-xl shadow-2xl p-2 sm:p-4 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
            <div className="rounded-xl overflow-hidden border border-brand-neutral-90 bg-white h-[450px] flex text-left relative shadow-inner">
               
               {/* Sidebar */}
               <div className="w-48 border-r border-brand-neutral-90 bg-brand-neutral-99 flex flex-col p-4 shrink-0 hidden sm:flex">
                 <div className="font-bold text-brand-neutral-10 mb-8 flex items-center gap-2">
                   <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center text-white text-xs"><MessageSquare size={14} /></div>
                   Signal
                 </div>
                 <div className="space-y-2">
                   <div className="px-3 py-2 text-sm text-brand-neutral-40 font-medium rounded-lg hover:bg-brand-neutral-95 cursor-pointer flex items-center gap-2"><BarChart3 size={16}/> Dashboard</div>
                   <div className="px-3 py-2 text-sm text-brand-primary font-medium bg-brand-primary-95 rounded-lg flex items-center gap-2"><Users size={16}/> Leads</div>
                   <div className="px-3 py-2 text-sm text-brand-neutral-40 font-medium rounded-lg hover:bg-brand-neutral-95 cursor-pointer flex items-center gap-2"><Upload size={16}/> Campaigns</div>
                 </div>
               </div>

               {/* Main Content */}
               <div className="flex-1 flex flex-col bg-white">
                 {/* Topbar */}
                 <div className="h-14 border-b border-brand-neutral-90 flex items-center px-6 justify-between bg-white">
                   <h3 className="font-semibold text-brand-neutral-10 text-lg">Leads Directory</h3>
                   <div className="flex gap-2">
                     <div className="px-3 py-1.5 text-xs font-medium border border-brand-neutral-90 rounded-lg text-brand-neutral-20">Filter</div>
                     <div className="px-3 py-1.5 text-xs font-medium bg-brand-primary text-white rounded-lg flex items-center gap-1"><Upload size={14} /> Import</div>
                   </div>
                 </div>
                 
                 {/* Table */}
                 <div className="p-6">
                   <div className="border border-brand-neutral-90 rounded-xl overflow-hidden">
                     <table className="w-full text-sm text-left">
                       <thead className="bg-brand-neutral-98 text-brand-neutral-40 font-medium border-b border-brand-neutral-90">
                         <tr>
                           <th className="px-4 py-3 font-medium">Name</th>
                           <th className="px-4 py-3 font-medium">Phone Number</th>
                           <th className="px-4 py-3 font-medium">Status</th>
                           <th className="px-4 py-3 font-medium text-right">Added</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-brand-neutral-90 text-brand-neutral-20">
                         <tr className="hover:bg-brand-neutral-99">
                           <td className="px-4 py-3 font-medium text-brand-neutral-10">Sarah Jenkins</td>
                           <td className="px-4 py-3">+1 (555) 019-2834</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 bg-brand-success-95 text-brand-success-40 rounded-md text-xs font-medium">Replied</span></td>
                           <td className="px-4 py-3 text-right text-brand-neutral-40">2h ago</td>
                         </tr>
                         <tr className="hover:bg-brand-neutral-99">
                           <td className="px-4 py-3 font-medium text-brand-neutral-10">Michael Chen</td>
                           <td className="px-4 py-3">+1 (555) 837-1928</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 bg-brand-primary-95 text-brand-primary-40 rounded-md text-xs font-medium">Sent</span></td>
                           <td className="px-4 py-3 text-right text-brand-neutral-40">5h ago</td>
                         </tr>
                         <tr className="hover:bg-brand-neutral-99">
                           <td className="px-4 py-3 font-medium text-brand-neutral-10">Elena Rodriguez</td>
                           <td className="px-4 py-3">+1 (555) 432-8841</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 bg-brand-neutral-95 text-brand-neutral-40 rounded-md text-xs font-medium">Queued</span></td>
                           <td className="px-4 py-3 text-right text-brand-neutral-40">1d ago</td>
                         </tr>
                         <tr className="hover:bg-brand-neutral-99">
                           <td className="px-4 py-3 font-medium text-brand-neutral-10">David Kim</td>
                           <td className="px-4 py-3">+1 (555) 918-2736</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 bg-brand-error-95 text-brand-error-50 rounded-md text-xs font-medium">Failed</span></td>
                           <td className="px-4 py-3 text-right text-brand-neutral-40">1d ago</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[var(--sys-typography-headline-headline-large-font-size)] font-[var(--sys-typography-headline-headline-large-font-weight)] tracking-[var(--sys-typography-headline-headline-large-letter-spacing)] text-brand-neutral-10 mb-4">
              Everything you need for successful campaigns
            </h2>
            <p className="text-[var(--sys-typography-body-body-large-font-size)] text-brand-neutral-40">
              Send Signal gives you powerful tools to manage leads, orchestrate messaging, and analyze results seamlessly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-2xl p-8 border border-brand-neutral-90 bg-brand-neutral-99 hover:bg-white hover:shadow-xl hover:border-brand-primary-80 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-brand-primary-95 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload size={28} />
              </div>
              <h3 className="text-[var(--sys-typography-title-title-large-font-size)] font-[var(--sys-typography-title-title-large-font-weight)] text-brand-neutral-10 mb-3">
                Smart Lead Import
              </h3>
              <p className="text-[var(--sys-typography-body-body-medium-font-size)] text-brand-neutral-40">
                Easily upload CSV files with flexible column mapping, automatic phone number validation, and intelligent duplicate detection.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group rounded-2xl p-8 border border-brand-neutral-90 bg-brand-neutral-99 hover:bg-white hover:shadow-xl hover:border-brand-primary-80 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-brand-success-95 flex items-center justify-center text-brand-success-40 mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-[var(--sys-typography-title-title-large-font-size)] font-[var(--sys-typography-title-title-large-font-weight)] text-brand-neutral-10 mb-3">
                Dynamic Templates
              </h3>
              <p className="text-[var(--sys-typography-body-body-medium-font-size)] text-brand-neutral-40">
                Create reusable message templates using placeholders like First Name or Company to personalize outreach at scale.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group rounded-2xl p-8 border border-brand-neutral-90 bg-brand-neutral-99 hover:bg-white hover:shadow-xl hover:border-brand-primary-80 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-brand-warning-95 flex items-center justify-center text-brand-warning-40 mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-[var(--sys-typography-title-title-large-font-size)] font-[var(--sys-typography-title-title-large-font-weight)] text-brand-neutral-10 mb-3">
                Campaign Analytics
              </h3>
              <p className="text-[var(--sys-typography-body-body-medium-font-size)] text-brand-neutral-40">
                Track delivery rates, read receipts, and replies in real-time. Optimize your strategy based on actionable data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section id="use-cases" className="py-24 bg-brand-neutral-98">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[var(--sys-typography-headline-headline-large-font-size)] font-[var(--sys-typography-headline-headline-large-font-weight)] tracking-[var(--sys-typography-headline-headline-large-letter-spacing)] text-brand-neutral-10 mb-6">
                Built for teams that rely on fast communication
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-neutral-90 text-brand-primary">
                    <Rocket size={24} />
                  </div>
                  <div>
                    <h4 className="text-[var(--sys-typography-title-title-large-font-size)] font-[var(--sys-typography-title-title-large-font-weight)] text-brand-neutral-10 mb-2">Solo Founders & Sales</h4>
                    <p className="text-[var(--sys-typography-body-body-medium-font-size)] text-brand-neutral-40">Run automated outbound campaigns to connect with leads instantly without manual copying and pasting.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-neutral-90 text-brand-success-40">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-[var(--sys-typography-title-title-large-font-size)] font-[var(--sys-typography-title-title-large-font-weight)] text-brand-neutral-10 mb-2">Educational Institutions</h4>
                    <p className="text-[var(--sys-typography-body-body-medium-font-size)] text-brand-neutral-40">Follow up with bootcamp applicants, send reminders, and share curriculum details efficiently.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-neutral-90 text-brand-secondary-40">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-[var(--sys-typography-title-title-large-font-size)] font-[var(--sys-typography-title-title-large-font-weight)] text-brand-neutral-10 mb-2">Marketing Agencies</h4>
                    <p className="text-[var(--sys-typography-body-body-medium-font-size)] text-brand-neutral-40">Manage multiple client outreach campaigns securely while respecting strict opt-in guidelines.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-success-40 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border border-brand-neutral-90 p-8">
                 <div className="flex flex-col gap-4">
                   <div className="self-end bg-brand-success-95 text-brand-success-30 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                     Hi Alex! Your application for the Summer Coding Bootcamp has been received. Have any questions?
                   </div>
                   <div className="self-start bg-brand-neutral-95 text-brand-neutral-20 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                     Yes, actually! When will I hear back about the next steps?
                   </div>
                   <div className="self-end bg-brand-success-95 text-brand-success-30 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                     You can expect an update by Friday. We're excited to review your portfolio!
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE SECTION */}
      <section className="py-24 bg-brand-neutral-95 text-brand-neutral-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle at center, var(--sys-primitive-color-collection-1-color-palettes-success-success40) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-brand-neutral-90 mb-6 shadow-sm">
                <ShieldCheck size={32} className="text-brand-success-50" />
              </div>
              <h2 className="text-[var(--sys-typography-headline-headline-large-font-size)] font-[var(--sys-typography-headline-headline-large-font-weight)] tracking-[var(--sys-typography-headline-headline-large-letter-spacing)] mb-6 text-brand-neutral-10">
                Enterprise-grade compliance built-in
              </h2>
              <p className="text-[var(--sys-typography-body-body-large-font-size)] text-brand-neutral-40 mb-8 max-w-xl">
                We take WhatsApp Business API guidelines seriously so you never have to worry about platform bans or spam complaints.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-success-50 shrink-0 mt-0.5" />
                  <span className="text-brand-neutral-30"><strong>Opt-in enforcement:</strong> Ensure messaging only targets validated contacts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-success-50 shrink-0 mt-0.5" />
                  <span className="text-brand-neutral-30"><strong>Auto-Unsubscribe:</strong> Instant recognition of STOP, UNSUBSCRIBE, and END keywords.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-success-50 shrink-0 mt-0.5" />
                  <span className="text-brand-neutral-30"><strong>Idempotent Messaging:</strong> Flawless duplicate prevention guarantees no lead is contacted twice.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-success-50 shrink-0 mt-0.5" />
                  <span className="text-brand-neutral-30"><strong>Rate Limit Awareness:</strong> Dynamic batching and delays protect your sender reputation.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white rounded-2xl p-8 border border-brand-neutral-90 shadow-xl">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-brand-neutral-95">
                  <div className="h-3 w-3 rounded-full bg-brand-success-50 shadow-[0_0_10px_var(--sys-primitive-color-collection-1-color-palettes-success-success50)] animate-pulse" />
                  <span className="text-sm font-bold text-brand-neutral-10 tracking-widest uppercase">System Status Secure</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-neutral-40">Duplicate Checks</span>
                    <span className="text-brand-success-50 font-medium">Active</span>
                  </div>
                  <div className="w-full bg-brand-neutral-95 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-success-50 w-full h-full"></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mt-6">
                    <span className="text-brand-neutral-40">Unsubscribe Handling</span>
                    <span className="text-brand-success-50 font-medium">Active</span>
                  </div>
                  <div className="w-full bg-brand-neutral-95 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-success-50 w-full h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[var(--sys-typography-headline-headline-large-font-size)] font-[var(--sys-typography-headline-headline-large-font-weight)] tracking-[var(--sys-typography-headline-headline-large-letter-spacing)] text-brand-neutral-10 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[var(--sys-typography-body-body-large-font-size)] text-brand-neutral-40">
              Choose the plan that best fits your outreach volume. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Free Tier */}
            <div className="rounded-3xl p-8 border border-brand-neutral-90 bg-white shadow-sm flex flex-col h-full">
              <h3 className="text-xl font-semibold text-brand-neutral-10 mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tight text-brand-neutral-10">$0</span>
                <span className="text-sm font-medium text-brand-neutral-40">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-brand-neutral-30">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Up to 500 leads</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> 2 Campaign templates</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Basic analytics</li>
              </ul>
              <Link href="/register" className="w-full flex justify-center text-center rounded-xl bg-brand-neutral-95 hover:bg-brand-neutral-90 text-brand-neutral-10 py-3 font-semibold transition-colors">
                Get Started
              </Link>
            </div>
            
            {/* Pro Tier */}
            <div className="rounded-3xl p-8 border-2 border-brand-primary bg-brand-neutral-10 text-white shadow-xl flex flex-col h-full transform md:-translate-y-4 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tight">$20</span>
                <span className="text-sm font-medium text-brand-neutral-60">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-brand-neutral-80">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Up to 10,000 leads</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Unlimited templates</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Advanced analytics</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Priority support</li>
              </ul>
              <Link href="/register" className="w-full flex justify-center text-center rounded-xl bg-brand-primary hover:bg-brand-primary-30 text-white py-3 font-semibold transition-colors shadow-lg shadow-brand-primary-20">
                Start Free Trial
              </Link>
            </div>
            
            {/* Enterprise Tier */}
            <div className="rounded-3xl p-8 border border-brand-neutral-90 bg-white shadow-sm flex flex-col h-full">
              <h3 className="text-xl font-semibold text-brand-neutral-10 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold tracking-tight text-brand-neutral-10">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-brand-neutral-30">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Unlimited leads</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Multiple team members</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Custom API integrations</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-brand-primary" /> Dedicated account manager</li>
              </ul>
              <Link href="/contact" className="w-full flex justify-center text-center rounded-xl bg-brand-neutral-95 hover:bg-brand-neutral-90 text-brand-neutral-10 py-3 font-semibold transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
