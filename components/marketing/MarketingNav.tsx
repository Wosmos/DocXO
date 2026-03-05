import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function MarketingNav({ activePath }: { activePath?: string }) {
  const links = [
    { href: '/#features', label: 'Features' },
    { href: '/#testimonials', label: 'Testimonials' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-primary">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M8 12L12 8H20L24 12V20L20 24H12L8 20V12Z" fill="white" fillOpacity="0.9" />
            <path d="M13 14H19V15.5H13V14ZM13 17H17V18.5H13V17Z" fill="currentColor" />
          </svg>
          <span className="text-lg font-semibold tracking-tight">Wosmo</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-foreground ${
                activePath === href ? 'font-medium text-foreground' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
