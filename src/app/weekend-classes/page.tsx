import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge, Button, GlassCard, Section } from '@/components/ui';
import WeekendClassesSignupForm from '@/components/marketing/WeekendClassesSignupForm';
import { robotixProfile } from '@/lib/robotix-profile';
import { weekendClassesProfile } from '@/lib/weekend-classes';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock3,
  Cpu,
  ExternalLink,
  GraduationCap,
  MapPin,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

export default function WeekendClassesPage() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="aurora-bg absolute inset-0 opacity-80" />
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
            <div>
              <Badge variant="accent" className="mb-4">
                <Clock3 className="mr-1 h-3 w-3" />
                Weekend Classes
              </Badge>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">
                A weekend STEM story parents can actually believe.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                Robotix already has a public track record of weekend robotics and coding experiences with BongoHive.
                This page turns that evidence into a clear, parent-friendly story about what children can learn,
                why the format works, and why families across Lusaka may want to start here.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#signup">
                  <Button icon={<ArrowRight className="h-4 w-4" />}>Ask about current weekend intake</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" icon={<Shield className="h-4 w-4" />}>
                    Contact Robotix directly
                  </Button>
                </Link>
              </div>
            </div>

            <GlassCard className="p-6 shine-effect">
              <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/95 p-3">
                  <Image
                    src={weekendClassesProfile.partner.logoSrc}
                    alt={weekendClassesProfile.partner.logoAlt}
                    width={120}
                    height={120}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Publicly documented partner</div>
                  <div className="mt-2 font-heading text-2xl font-semibold">{weekendClassesProfile.partner.name}</div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Public BongoHive coverage links Robotix to weekend robotics and programming sessions for young
                    learners in Lusaka.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Public hours', value: robotixProfile.openHours },
                  { label: 'BongoHive trail', value: '2024 to 2026' },
                  { label: 'Documented age range', value: '6 to 18' },
                  { label: 'Parent story', value: 'Weekend + after-school fit' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">{item.label}</div>
                    <div className="mt-3 text-lg font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Section className="py-8">
        <div className="grid gap-5 md:grid-cols-3 stagger-children">
          {weekendClassesProfile.storyHighlights.map((item, index) => {
            const icons = [Sparkles, Cpu, Users];
            const Icon = icons[index] ?? Sparkles;

            return (
              <GlassCard key={item.title} className="p-6 shine-effect school-lift">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/58">{item.detail}</p>
              </GlassCard>
            );
          })}
        </div>
      </Section>

      <Section className="py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              <Building2 className="mr-1 h-3 w-3" />
              BongoHive Partnership
            </Badge>
            <h2 className="font-heading text-3xl font-bold">Weekend classes with real ecosystem credibility</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              Public BongoHive articles show that Robotix&apos;s weekend classes have been connected to a real innovation
              ecosystem, not just marketed as a generic kids program. That matters to parents who want both safety and
              seriousness.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard className="overflow-hidden p-0 shine-effect">
            <div className="relative h-full min-h-[340px]">
              <Image
                src={weekendClassesProfile.gallery[2].src}
                alt={weekendClassesProfile.gallery[2].alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/92 p-2">
                    <Image
                      src={weekendClassesProfile.partner.logoSrc}
                      alt={weekendClassesProfile.partner.logoAlt}
                      width={90}
                      height={90}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <Badge variant="accent">Weekend session evidence</Badge>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/72">
                  {weekendClassesProfile.gallery[2].caption}
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4">
            {weekendClassesProfile.publicMoments.map((item) => (
              <GlassCard key={item.title} className="p-5 school-lift">
                <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">{item.date}</div>
                <h3 className="mt-3 font-heading text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.detail}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="p-6 shine-effect">
            <Badge variant="accent" className="mb-3">
              <GraduationCap className="mr-1 h-3 w-3" />
              What Children Learn
            </Badge>
            <h2 className="font-heading text-3xl font-bold">More than robotics kits and coding syntax</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              The public record paints Robotix as a place where children build technical skill and confidence at the
              same time. That combination is exactly what many parents are searching for when school alone does not
              feel like enough.
            </p>
            <div className="mt-6 grid gap-4">
              {weekendClassesProfile.formatCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 school-lift">
                  <div className="font-semibold text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 shine-effect">
            <Badge variant="accent" className="mb-3">
              <Users className="mr-1 h-3 w-3" />
              Parent Fit
            </Badge>
            <h2 className="font-heading text-3xl font-bold">Why busy families keep saying yes</h2>
            <div className="mt-4 space-y-3">
              {weekendClassesProfile.parentReasons.map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/62 school-lift"
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-brand-secondary/20 bg-brand-secondary/10 p-4 text-sm leading-6 text-white/72">
              Public BongoHive coverage from June 1, 2025 described a Saturday cohort at Hive Coworking in Lusaka.
              Robotix&apos;s current contact page, reviewed on May 18, 2026, lists open hours as Saturday to Wednesday,
              10AM to 7PM. For the current intake, the safest next step is to contact Robotix directly.
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="py-8">
        <div className="mb-6">
          <Badge variant="accent" className="mb-3">
            <Users className="mr-1 h-3 w-3" />
            Parent Signals
          </Badge>
          <h2 className="font-heading text-3xl font-bold">What the public story suggests parents value most</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
            These are not invented testimonials. They are parent-style takeaways drawn from Robotix and BongoHive
            public coverage about weekend sessions, hands-on learning, and confidence-building.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 stagger-children">
          {[
            {
              title: '“My child is building things, not just watching videos.”',
              detail:
                'Robotix and BongoHive both describe learners creating robots, games, apps, and websites, which gives parents a clearer picture of real output.',
              source: 'Drawn from BongoHive’s January 19, 2025 and June 1, 2025 program articles.',
            },
            {
              title: '“Weekend time is turning into confidence and curiosity.”',
              detail:
                'Robotix’s after-school message centers creativity, teamwork, and problem-solving, while BongoHive describes students thriving in an exciting weekend environment.',
              source: 'Drawn from Robotix’s after-school article and BongoHive’s public program coverage.',
            },
            {
              title: '“This feels connected to a serious innovation community.”',
              detail:
                'The BongoHive partnership and the Human-Centred Design session make the program feel bigger than a basic club, which can reassure parents looking for quality.',
              source: 'Drawn from BongoHive Consult’s March 23, 2026 weekend-session article.',
            },
          ].map((item) => (
            <GlassCard key={item.title} className="p-6 shine-effect school-lift">
              <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Parent-style takeaway</div>
              <h3 className="mt-4 font-heading text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.detail}</p>
              <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/46">
                {item.source}
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8" id="signup">
        <WeekendClassesSignupForm />
      </Section>

      <Section className="py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              <CalendarDays className="mr-1 h-3 w-3" />
              Gallery
            </Badge>
            <h2 className="font-heading text-3xl font-bold">Weekend-class visuals from public coverage</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              These images come from Robotix and BongoHive public pages tied to the weekend classes story.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 stagger-children">
          {weekendClassesProfile.gallery.map((image) => (
            <GlassCard key={image.src} className="overflow-hidden p-0 shine-effect school-lift">
              <div className="relative h-64">
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-white/62">{image.caption}</p>
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-brand-secondary transition hover:text-white"
                >
                  View original source
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <GlassCard className="p-6 shine-effect">
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <Badge variant="accent" className="mb-3">
                <MapPin className="mr-1 h-3 w-3" />
                Practical Next Step
              </Badge>
              <h2 className="font-heading text-3xl font-bold">Bring the parent story to a real conversation</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                The public evidence is already strong: school partnerships, BongoHive-linked weekend sessions, and an
                after-school learning story built around creativity and problem-solving. Now the best move is simply to
                ask Robotix what the current weekend intake looks like for your child.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/64">
                <span className="font-semibold text-white">Public hours:</span> {robotixProfile.openHours}
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/64">
                <span className="font-semibold text-white">Public venue example:</span> {weekendClassesProfile.partner.address}
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/64">
                <span className="font-semibold text-white">Verified:</span> {weekendClassesProfile.verifiedOn}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#signup">
              <Button>Sign up your child</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary">Talk to Robotix directly</Button>
            </Link>
          </div>
        </GlassCard>
      </Section>

      <Section className="py-8" id="sources">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {weekendClassesProfile.sourceLinks.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64 transition hover:border-brand-secondary/30 hover:text-white"
            >
              <div className="flex items-start justify-between gap-3">
                <span>{source.label}</span>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Footer />
    </main>
  );
}
