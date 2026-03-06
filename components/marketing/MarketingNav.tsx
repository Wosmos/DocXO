import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function MarketingNav({ activePath }: { activePath?: string }) {
  const links = [
    { href: '/#live', label: 'Product' },
    { href: '/#flow', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex-none font-serif text-2xl font-bold tracking-tight dark:font-sans dark:font-extrabold dark:tracking-tighter"
        >
          Doc<span className="text-primary">XO</span>
        </Link>

        {/* decorative document toolbar — the signature "editor" chrome */}
        <div
          aria-hidden="true"
          className="ml-2 hidden items-center gap-0.5 rounded-xl border border-border bg-card p-1 shadow-editorial md:flex"
        >
          <button
            type="button"
            tabIndex={-1}
            className="grid size-8 place-items-center rounded-lg font-serif text-sm font-extrabold text-muted-foreground hover:bg-soft hover:text-primary"
          >
            B
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="grid size-8 place-items-center rounded-lg font-serif text-sm italic text-muted-foreground hover:bg-soft hover:text-primary"
          >
            I
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="grid size-8 place-items-center rounded-lg font-serif text-sm text-muted-foreground underline hover:bg-soft hover:text-primary"
          >
            U
          </button>
          <span className="mx-1 h-[18px] w-px bg-border" />
          <button
            type="button"
            tabIndex={-1}
            className="grid size-8 place-items-center rounded-lg font-serif text-sm text-muted-foreground hover:bg-soft hover:text-primary"
          >
            H
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-soft hover:text-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-soft hover:text-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
            </svg>
          </button>
        </div>

        <div className="ml-auto hidden items-center gap-7 font-sans text-sm text-muted-foreground sm:flex">
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

        <div className="flex flex-none items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="hidden font-sans text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:brightness-110"
          >
            Start writing free
          </Link>
        </div>
      </div>
    </nav>
  );
}
