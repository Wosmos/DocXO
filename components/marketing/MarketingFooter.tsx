import Link from 'next/link';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 pb-10 pt-11">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight dark:font-sans dark:font-extrabold dark:tracking-tighter"
            >
              Doc<span className="text-primary">XO</span>
            </Link>
            <p className="mt-2.5 max-w-[28ch] font-sans text-sm text-muted-foreground">
              Collaborative writing, beautifully simple. Draft together in real time.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[.12em] text-muted-foreground">
              Product
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/#live" className="font-sans text-sm text-foreground/80 hover:text-primary">Real-time editing</Link>
              <Link href="/#live" className="font-sans text-sm text-foreground/80 hover:text-primary">Comments</Link>
              <Link href="/#history" className="font-sans text-sm text-foreground/80 hover:text-primary">Version history</Link>
              <Link href="/pricing" className="font-sans text-sm text-foreground/80 hover:text-primary">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[.12em] text-muted-foreground">
              Resources
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#" className="font-sans text-sm text-foreground/80 hover:text-primary">Docs</a>
              <a href="#" className="font-sans text-sm text-foreground/80 hover:text-primary">Changelog</a>
              <a href="#" className="font-sans text-sm text-foreground/80 hover:text-primary">Keyboard shortcuts</a>
            </div>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[.12em] text-muted-foreground">
              Made by
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="https://wosmos.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm text-foreground/80 hover:text-primary"
              >
                Wasif Malik
              </a>
              <a
                href="https://github.com/Wosmos/DocXO"
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm text-foreground/80 hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2.5 border-t border-border/60 pt-[18px] font-sans text-[13px] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} DocXO</span>
          <span>
            Crafted by{' '}
            <a
              href="https://wosmos.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary"
            >
              Wasif Malik
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
