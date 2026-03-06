import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { FeatherIcon, CommentIcon, SlashIcon, DocIcon, ExportIcon } from '@/components/marketing/icons';

const marqueeItems = [
  'Live cursors',
  'Inline comments',
  'Version history',
  'Slash menu',
  'Presence',
  'Export anywhere',
];

const versionRows = [
  { initial: 'W', color: 'bg-primary', label: 'Wasif · restructured the phases', time: '2h ago', restore: false },
  { initial: 'A', color: 'bg-accent2', label: 'Ayesha · design-partner notes', time: '1h ago', restore: true },
  { initial: 'S', color: 'bg-accent3', label: 'Sara · tightened the intro', time: '12m ago', restore: false },
];

export default async function LandingPage() {
  const user = await currentUser();
  if (user) redirect('/dashboard');

  return (
    <div className="editorial-glow min-h-screen bg-background text-foreground">
      <MarketingNav />

      {/* ─── HERO ─── */}
      <header className="mx-auto max-w-6xl px-4 pb-2 pt-9 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.02fr_1.1fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-soft px-3 py-1.5 font-mono text-xs uppercase tracking-[.05em] text-primary">
              <span className="size-[7px] animate-pulse rounded-full bg-accent2" />
              3 people editing now
            </span>

            <h1 className="font-serif text-[clamp(42px,7vw,80px)] font-semibold leading-[1.0] tracking-[-.015em] text-balance dark:font-sans dark:font-extrabold dark:tracking-[-.03em]">
              Write together,{' '}
              <span className="text-gradient-accent">in real time.</span>
            </h1>
            <p className="mt-[22px] max-w-[44ch] font-sans text-[clamp(17px,2.2vw,20px)] text-muted-foreground">
              Live cursors, inline comments, and full version history — in an editor so calm it disappears the moment you start typing.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:brightness-110"
              >
                Start a document
              </Link>
              <a
                href="#live"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 font-sans text-sm font-semibold text-foreground transition-all hover:-translate-y-px"
              >
                Watch it live
              </a>
              <span className="font-sans text-[13px] text-muted-foreground">free · no card</span>
            </div>
          </div>

          {/* ── signature demo: the live multiplayer editor ── */}
          <div className="relative overflow-hidden rounded-[18px] border border-border bg-card shadow-editorial">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="font-mono text-[13px] text-muted-foreground">Q3-launch-brief.doc</span>
              <div className="ml-auto flex items-center">
                <span className="-ml-2 grid size-[26px] place-items-center rounded-full border-2 border-card bg-primary font-sans text-[11px] font-bold text-primary-foreground">W</span>
                <span className="-ml-2 grid size-[26px] place-items-center rounded-full border-2 border-card bg-accent2 font-sans text-[11px] font-bold text-white">A</span>
                <span className="-ml-2 grid size-[26px] place-items-center rounded-full border-2 border-card bg-accent3 font-sans text-[11px] font-bold text-white">S</span>
              </div>
            </div>

            <div className="relative min-h-[270px] px-6 pb-7 pt-6">
              <span className="animate-cursor-a pointer-events-none absolute left-[44px] top-[98px] whitespace-nowrap rounded-md rounded-bl-none bg-accent2 px-1.5 py-0.5 font-mono text-[10.5px] text-white">
                Ayesha
              </span>
              <span className="animate-cursor-b pointer-events-none absolute left-[150px] top-[150px] whitespace-nowrap rounded-md rounded-bl-none bg-accent3 px-1.5 py-0.5 font-mono text-[10.5px] text-white">
                Sara
              </span>

              <h4 className="mb-3 font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">
                Q3 Launch Brief
              </h4>
              <p className="mb-3 max-w-[52ch] text-[15.5px] leading-[1.9]">
                The rollout lands in three phases, each earning the next. First, a{' '}
                <span className="rounded-[3px] bg-accent2/20 px-px py-px">private beta</span>{' '}
                for design partners, then a considered waitlist, and only then
                <span className="animate-caret-blink ml-px inline-block h-[1.06em] w-[2px] translate-y-[2px] bg-primary" />
              </p>
              <p className="mb-3 max-w-[52ch] text-[15.5px] leading-[1.9] text-muted-foreground">
                the public unveiling —{' '}
                <span className="animate-type-reveal">backed by the new case-study set</span>
              </p>

              <div className="live-comment-popup absolute right-[-10px] top-[120px] w-[190px] origin-top-right rounded-xl border border-border bg-card p-3 font-sans text-[12.5px] shadow-editorial animate-pop-in">
                <b className="text-primary">Bilal</b> · pull the pricing page earlier? It&apos;s our strongest asset.{' '}
                <Check className="-mb-px inline size-3 text-accent2" strokeWidth={2.6} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MARQUEE ─── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-8 overflow-hidden border-y border-border py-0.5">
          <div className="flex w-max marquee-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8 whitespace-nowrap py-4 font-serif text-[22px] italic text-muted-foreground dark:font-sans dark:not-italic dark:font-semibold">
                {marqueeItems.map((item) => (
                  <span key={item} className="flex items-center gap-8">
                    <b className="font-semibold not-italic text-primary dark:font-extrabold">{item}</b>
                    <span className="size-[5px] rounded-full bg-accent2" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ─── LIVE COLLABORATION ─── */}
        <section id="live" className="py-[70px]">
          <div className="mx-auto mb-11 max-w-[60ch] text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[.16em] text-primary">Real-time collaboration</p>
            <h2 className="font-serif text-[clamp(30px,4.6vw,46px)] font-semibold text-balance dark:font-sans dark:font-extrabold">
              Everyone, on the same line.
            </h2>
            <p className="mt-3.5 font-sans text-[17px] text-muted-foreground">
              Presence you can feel — cursors, selections, and edits stream in with no refresh, no conflicts, no &quot;who has the latest version?&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-[18px] border border-border bg-card p-6 shadow-editorial">
              <div className="grid size-[46px] place-items-center rounded-[13px] bg-soft text-primary">
                <FeatherIcon className="size-[22px]" />
              </div>
              <h3 className="mb-2 mt-4 font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">Live cursors &amp; presence</h3>
              <p className="font-sans text-[14.5px] text-muted-foreground">See exactly where teammates are, name-tagged and color-coded, moving as they type.</p>
            </div>
            <div className="rounded-[18px] border border-border bg-card p-6 shadow-editorial">
              <div className="grid size-[46px] place-items-center rounded-[13px] bg-soft text-primary">
                <CommentIcon className="size-[22px]" />
              </div>
              <h3 className="mb-2 mt-4 font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">Inline comments</h3>
              <p className="font-sans text-[14.5px] text-muted-foreground">Comment on any selection. Threads resolve quietly in the margin — never blocking the words.</p>
            </div>
            <div className="rounded-[18px] border border-border bg-card p-6 shadow-editorial">
              <div className="grid size-[46px] place-items-center rounded-[13px] bg-soft text-primary">
                <SlashIcon className="size-[22px]" />
              </div>
              <h3 className="mb-2 mt-4 font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">Slash everything</h3>
              <p className="font-sans text-[14.5px] text-muted-foreground">
                Type <b className="text-foreground">/</b> for headings, to-dos, tables, code, callouts. Structure without leaving the keyboard.
              </p>
            </div>
          </div>
        </section>

        {/* ─── VERSION HISTORY ─── */}
        <section id="history" className="py-[70px]">
          <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[.16em] text-primary">Version history</p>
              <h2 className="font-serif text-[clamp(28px,4.4vw,42px)] font-semibold text-balance dark:font-sans dark:font-extrabold">
                Every version, remembered.
              </h2>
              <p className="mt-3.5 max-w-[38ch] font-sans text-base text-muted-foreground">
                Scrub back to any moment in the document&apos;s life and restore it in a single click. Nothing is ever really lost.
              </p>
            </div>

            <div className="rounded-[18px] border border-border bg-card px-6 py-[22px] shadow-editorial">
              <div className="my-1.5 mb-3.5 flex items-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-1 items-center last:flex-none">
                    <span className={`size-3.5 rounded-full ${i === 2 ? 'bg-primary shadow-[0_0_0_5px_hsl(var(--soft))]' : 'bg-border'}`} />
                    {i < 4 && <span className="h-px flex-1 bg-border" />}
                  </div>
                ))}
              </div>
              {versionRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3 border-t border-border py-2.5 font-sans text-[13px]">
                  <span className={`grid size-[26px] place-items-center rounded-full font-sans text-[11px] font-bold text-white ${row.color}`}>
                    {row.initial}
                  </span>
                  <span>{row.label}</span>
                  {row.restore && <span className="font-semibold text-primary">Restore</span>}
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{row.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BUILT FOR FLOW ─── */}
        <section id="flow" className="py-[70px]">
          <div className="mx-auto mb-11 max-w-[60ch] text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[.16em] text-primary">Built for flow</p>
            <h2 className="font-serif text-[clamp(30px,4.6vw,46px)] font-semibold text-balance dark:font-sans dark:font-extrabold">
              Nothing to learn. Everything flows.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-[18px] border border-border bg-card p-6 shadow-editorial">
              <div className="max-w-[260px] rounded-[14px] border border-border bg-background p-2 shadow-editorial">
                <div className="border-b border-border px-2.5 py-2 font-mono text-[13px] text-muted-foreground">/ …</div>
                <div className="flex items-center gap-2.5 rounded-lg bg-soft px-2.5 py-2 font-sans text-[13.5px] text-primary">
                  <span className="grid size-6 place-items-center rounded-md bg-background font-mono text-xs">H1</span>
                  Heading
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[13.5px]">
                  <span className="grid size-6 place-items-center rounded-md bg-background font-mono text-xs">☑</span>
                  To-do list
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[13.5px]">
                  <span className="grid size-6 place-items-center rounded-md bg-background font-mono text-xs">▦</span>
                  Table
                </div>
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[13.5px]">
                  <span className="grid size-6 place-items-center rounded-md bg-background font-mono text-xs">{'{ }'}</span>
                  Code block
                </div>
              </div>
              <h3 className="mb-2 mt-[18px] font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">A slash menu for structure</h3>
              <p className="font-sans text-[14.5px] text-muted-foreground">Blocks appear where your cursor is. No toolbars to hunt through.</p>
            </div>

            <div className="rounded-[18px] border border-border bg-card p-6 shadow-editorial">
              <div className="grid size-[46px] place-items-center rounded-[13px] bg-soft text-primary">
                <DocIcon className="size-[22px]" />
              </div>
              <h3 className="mb-2 mt-4 font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">Distraction-free canvas</h3>
              <p className="font-sans text-[14.5px] text-muted-foreground">Your words centered at a comfortable measure, the UI fading away as you write.</p>
            </div>

            <div className="rounded-[18px] border border-border bg-card p-6 shadow-editorial">
              <div className="grid size-[46px] place-items-center rounded-[13px] bg-soft text-primary">
                <ExportIcon className="size-[22px]" />
              </div>
              <h3 className="mb-2 mt-4 font-serif text-xl font-semibold dark:font-sans dark:font-extrabold">Export anywhere</h3>
              <p className="font-sans text-[14.5px] text-muted-foreground">Markdown, PDF, or a shareable link — your document leaves the way you need it to.</p>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="py-[70px]">
          <div className="grid grid-cols-3 gap-5 text-center">
            <div>
              <div className="text-gradient-accent font-serif text-[clamp(30px,4.4vw,48px)] font-semibold dark:font-sans dark:font-extrabold">&lt;40ms</div>
              <div className="mt-1 font-sans text-[13.5px] text-muted-foreground">Cursor sync latency</div>
            </div>
            <div>
              <div className="text-gradient-accent font-serif text-[clamp(30px,4.4vw,48px)] font-semibold dark:font-sans dark:font-extrabold">&infin;</div>
              <div className="mt-1 font-sans text-[13.5px] text-muted-foreground">Version history</div>
            </div>
            <div>
              <div className="text-gradient-accent font-serif text-[clamp(30px,4.4vw,48px)] font-semibold dark:font-sans dark:font-extrabold">0</div>
              <div className="mt-1 font-sans text-[13.5px] text-muted-foreground">Merge conflicts</div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section id="start" className="py-[70px]">
          <div className="rounded-[26px] border border-border bg-card px-6 py-[60px] text-center shadow-editorial sm:px-8">
            <h2 className="mx-auto max-w-[16ch] font-serif text-[clamp(32px,5.4vw,58px)] font-semibold leading-[1.02] text-balance dark:font-sans dark:font-extrabold">
              Start writing <span className="text-gradient-accent">together.</span>
            </h2>
            <p className="mx-auto mb-[26px] mt-4 max-w-[34ch] font-sans text-lg text-muted-foreground">
              Free to start, no credit card. Your first document is one click away.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-[30px] font-sans text-base font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:brightness-110"
            >
              Create a document →
            </Link>
          </div>
        </section>
      </div>

      <MarketingFooter />
    </div>
  );
}
