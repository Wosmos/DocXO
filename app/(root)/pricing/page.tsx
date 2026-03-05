import Link from 'next/link';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Wosmo',
  description: 'Simple, transparent pricing for teams of all sizes.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For individuals getting started.',
    cta: 'Start for free',
    href: '/sign-up',
    highlight: false,
    features: [
      { text: 'Up to 5 documents', included: true },
      { text: '1 collaborator per doc', included: true },
      { text: 'Basic templates', included: true },
      { text: 'Export to PDF & Markdown', included: true },
      { text: 'AI writing assistant', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom branding', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/user/month',
    description: 'For teams that ship together.',
    cta: 'Start free trial',
    href: '/sign-up',
    highlight: true,
    features: [
      { text: 'Unlimited documents', included: true },
      { text: 'Unlimited collaborators', included: true },
      { text: 'All templates', included: true },
      { text: 'Export to PDF, DOCX & Markdown', included: true },
      { text: 'AI writing assistant', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations at scale.',
    cta: 'Contact sales',
    href: '#',
    highlight: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'SSO / SAML', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Audit logs', included: true },
      { text: 'Dedicated support', included: true },
      { text: '99.99% SLA', included: true },
      { text: 'Custom branding', included: true },
    ],
  },
];

const faqs = [
  {
    q: 'Can I try Pro features for free?',
    a: 'Yes! Every new account gets a 14-day free trial of Pro with no credit card required.',
  },
  {
    q: 'What happens when my trial ends?',
    a: 'Your account automatically switches to the Free plan. No data is lost — you just can\'t create new documents beyond the free limit.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. Upgrade, downgrade, or cancel anytime from your account settings. Changes take effect immediately.',
  },
  {
    q: 'Do you offer discounts for nonprofits or education?',
    a: 'Yes — we offer 50% off Pro for verified nonprofit organizations and educational institutions. Contact us to apply.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav activePath="/pricing" />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[700px] rounded-full bg-primary/6 blur-3xl dark:bg-primary/4" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  tier.highlight
                    ? 'border-primary bg-card shadow-xl shadow-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                </div>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  )}
                </div>

                <Link
                  href={tier.href}
                  className={`mt-8 inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-all ${
                    tier.highlight
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90'
                      : 'border border-border bg-background hover:bg-accent'
                  }`}
                >
                  {tier.cta}
                </Link>

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map(({ text, included }) => (
                    <li key={text} className="flex items-start gap-3">
                      {included ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : (
                        <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span className={`text-sm ${included ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-border/50 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start building with Wosmo today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Free forever for individuals. No credit card required.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
            >
              Get started for free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
