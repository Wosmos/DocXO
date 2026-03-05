import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import {
  ArrowRight,
  FileText,
  Users,
  Zap,
  Shield,
  Globe,
  Sparkles,
  Check,
  Star,
  MessageSquare,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default async function LandingPage() {
  const user = await currentUser();
  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[600px] w-[900px] rounded-full bg-primary/8 blur-3xl dark:bg-primary/5" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28 lg:pt-36">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Now with AI writing assistant
            <ChevronRight className="size-3.5" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Write together,{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              beautifully
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            The collaborative document editor that gets out of your way. Real-time editing, clean design, and powerful tools — all in one place.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              Start writing for free
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-base font-medium transition-colors hover:bg-accent sm:w-auto"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="flex -space-x-2">
              {[
                'bg-emerald-500', 'bg-blue-500', 'bg-purple-500',
                'bg-amber-500', 'bg-rose-500',
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`size-8 rounded-full ${bg} ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">2,000+</span> teams worldwide
            </p>
          </div>
        </div>

        {/* Editor preview */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/5 dark:shadow-black/20">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-400/80" />
                <div className="size-3 rounded-full bg-yellow-400/80" />
                <div className="size-3 rounded-full bg-green-400/80" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-muted px-3 py-1">
                <Globe className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">wosmo.app/documents/project-brief</span>
              </div>
            </div>
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-border px-4 py-2">
              {['B', 'I', 'U'].map((l) => (
                <div key={l} className="flex size-8 items-center justify-center rounded-md text-xs font-bold text-muted-foreground hover:bg-accent">
                  {l}
                </div>
              ))}
              <div className="mx-2 h-4 w-px bg-border" />
              <div className="flex size-8 items-center justify-center rounded-md text-xs text-muted-foreground">H1</div>
              <div className="flex size-8 items-center justify-center rounded-md bg-accent text-xs font-medium text-accent-foreground">H2</div>
              <div className="flex size-8 items-center justify-center rounded-md text-xs text-muted-foreground">H3</div>
            </div>
            {/* Content */}
            <div className="px-8 py-8 sm:px-16 sm:py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">3 collaborators editing</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Q4 Product Roadmap</h2>
              <div className="mt-4 h-px bg-border" />
              <div className="mt-6 space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  Our focus this quarter is on shipping the new collaboration features and improving the core editing experience for all users across the platform.
                </p>
                <div className="space-y-2 pt-2">
                  {['Launch real-time commenting system', 'Ship AI writing assistant beta', 'Redesign document sharing flow'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className={`mt-0.5 size-4 shrink-0 ${i < 2 ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                      <span className={i < 2 ? 'text-foreground' : 'text-muted-foreground'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Cursor simulation */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-500/10 px-2 py-0.5">
                <div className="size-4 rounded-full bg-blue-500 text-[8px] font-bold text-white flex items-center justify-center">S</div>
                <span className="text-sm text-blue-600 dark:text-blue-400">Sarah is typing...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOGOS / SOCIAL PROOF BAR ─── */}
      <section className="border-y border-border/50 bg-muted/30 py-12 mt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Built with industry-leading technology
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {['Next.js', 'React', 'TypeScript', 'Tailwind', 'Liveblocks'].map((name) => (
              <span key={name} className="text-sm font-semibold tracking-wide text-foreground">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">Everything you need</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful features, zero complexity
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every tool you need to write, collaborate, and ship great documents.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Real-time collaboration',
                desc: 'See cursors, selections, and edits from your teammates as they happen. No more version conflicts.',
              },
              {
                icon: Sparkles,
                title: 'AI writing assistant',
                desc: 'Rewrite, summarize, fix grammar, or change tone — powered by AI that understands context.',
              },
              {
                icon: Zap,
                title: 'Instant performance',
                desc: 'Built on a modern stack with edge-optimized infrastructure. Every action feels instant.',
              },
              {
                icon: MessageSquare,
                title: 'Inline comments & threads',
                desc: 'Leave feedback right where it matters. Resolve threads and keep conversations organized.',
              },
              {
                icon: Shield,
                title: 'Secure by default',
                desc: 'Role-based access control with editor, viewer, and owner permissions on every document.',
              },
              {
                icon: Layers,
                title: 'Templates & exports',
                desc: 'Start from templates for meetings, briefs, and more. Export to PDF, DOCX, or Markdown.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BIG FEATURE SECTION ─── */}
      <section className="border-y border-border/50 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-primary">Collaboration, reimagined</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Your team&apos;s best writing happens here
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Wosmo brings your team together with real-time presence, instant updates, and a distraction-free editor that makes writing feel effortless.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'See who\'s online and what they\'re editing',
                  'Mention teammates with @mentions in comments',
                  'Share documents with a single link',
                  'Fine-grained permissions (view, edit, owner)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Try it free <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Feature visual */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', action: 'edited the introduction', time: '2m ago', color: 'bg-blue-500' },
                  { name: 'Alex Rivera', action: 'left a comment on paragraph 3', time: '5m ago', color: 'bg-emerald-500' },
                  { name: 'Jordan Lee', action: 'shared the document', time: '12m ago', color: 'bg-purple-500' },
                  { name: 'You', action: 'created the document', time: '1h ago', color: 'bg-amber-500' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${activity.color} text-xs font-bold text-white`}>
                      {activity.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">{activity.name}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">What people are saying</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by teams everywhere
            </h2>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: 'Wosmo replaced three different tools for our team. The real-time collaboration is buttery smooth.',
                name: 'Emily Zhang',
                role: 'Product Lead at Vercel',
              },
              {
                quote: 'The AI assistant saves me at least an hour per day on writing and editing. The grammar fixes alone are worth it.',
                name: 'Marcus Johnson',
                role: 'Content Strategist',
              },
              {
                quote: 'Clean, fast, and just works. We migrated from Notion for our docs and haven\'t looked back.',
                name: 'Priya Sharma',
                role: 'Engineering Manager',
              },
              {
                quote: 'The permission system is exactly what we needed. Clients can view, team can edit. Simple.',
                name: 'Tom Wilson',
                role: 'Agency Owner',
              },
              {
                quote: 'I love how it feels like writing in a focused environment. No distractions, just great typography.',
                name: 'Ana Costa',
                role: 'Technical Writer',
              },
              {
                quote: 'The inline commenting with @mentions makes async collaboration actually work for our remote team.',
                name: 'David Kim',
                role: 'Head of Design',
              },
            ].map(({ quote, name, role }, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-border/50 bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: '10k+', label: 'Documents created' },
              { value: '2k+', label: 'Active teams' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<50ms', label: 'Sync latency' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-foreground sm:text-4xl">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to write{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              something great?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of teams who use Wosmo to create, collaborate, and ship better documents every day.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 sm:w-auto"
            >
              Get started for free
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever for individuals. No credit card required.
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
