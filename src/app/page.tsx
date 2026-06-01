'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Cpu,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  Instagram,
  Mail,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PlayVerseShowcase } from '@/components/game/PlayVerseShowcase';
import { Badge, Button, GlassCard, Section } from '@/components/ui';
import { robotixProfile } from '@/lib/robotix-profile';
import { HeroSceneErrorBoundary } from '@/components/three/HeroSceneErrorBoundary';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-brand-dark" />,
});

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const audiences = ['Students', 'Parents', 'Schools', 'Partners'];

const accessRoutes = [
  {
    title: 'Weekend classes',
    description: 'A clear parent route for weekend robotics and coding enquiries.',
    href: '/weekend-classes',
    icon: GraduationCap,
  },
  {
    title: 'Courses and pathways',
    description: 'Structured learning journeys for students who want guided skill growth.',
    href: '/courses',
    icon: BookOpen,
  },
  {
    title: 'School partnerships',
    description: 'A direct entry point for schools, clubs, and institutional programs.',
    href: '/partners',
    icon: Building2,
  },
  {
    title: 'Projects and showcases',
    description: 'Real student work, public builds, and visible outcomes from Robotix programs.',
    href: '/projects',
    icon: Cpu,
  },
];

const homeCard = 'border-white/25 bg-white/[0.13] shadow-[0_24px_70px_rgba(255,255,255,0.08)]';
const homePanel = 'border-white/20 bg-white/[0.1]';
const homeInset = 'border-white/18 bg-white/[0.09]';

export default function HomePage() {
  const featuredPrograms = robotixProfile.programs.slice(0, 4);
  const trustSignals = robotixProfile.impactStats.slice(0, 4);
  const featuredPartnerships = robotixProfile.partnerships.slice(0, 4);
  const proofPoints = robotixProfile.communityWork.slice(0, 3);
  const buildStories = robotixProfile.projectsAndPlatforms.slice(0, 3);
  const contacts = robotixProfile.contacts.slice(0, 3);
  const mediaHighlights = robotixProfile.officialMedia.slice(0, 3);

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="aurora-bg absolute inset-0 opacity-100" />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-brand-secondary/10 to-brand-dark/90" />
        <div className="absolute left-[-12rem] top-24 h-[28rem] w-[28rem] rounded-full bg-white/12 blur-3xl" />
        <div className="absolute right-[-10rem] top-20 h-[26rem] w-[26rem] rounded-full bg-brand-secondary/24 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-accent/18 blur-3xl" />
        <Suspense fallback={null}>
          <HeroSceneErrorBoundary>
            <HeroScene />
          </HeroSceneErrorBoundary>
        </Suspense>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
              <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
                <Image
                  src="/images/icon-color.png"
                  alt="Robotix Institute emblem"
                  width={68}
                  height={68}
                  className="h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(29,242,255,0.3)]"
                  priority
                />
                <Badge variant="accent" className="border border-brand-secondary/20 bg-brand-secondary/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em]">
                  Lusaka STEM Institute
                </Badge>
              </motion.div>

              <motion.p variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-brand-accent">
                Robotix Institute Zambia
              </motion.p>

              <motion.h1 variants={fadeUp} className="max-w-4xl font-heading text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
                Hands-on robotics, coding, and STEM programs for students, families, and schools in Zambia.
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg text-white/68 sm:text-xl">
                {robotixProfile.summary} The website now leads with the institute&apos;s real programs, verified public footprint, and clear routes for parents, students, and school partners.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
                <Link href="/weekend-classes">
                  <Button variant="primary" size="lg" icon={<GraduationCap className="h-5 w-5" />}>
                    Explore Weekend Classes
                  </Button>
                </Link>
                <Link href="/partners">
                  <Button variant="secondary" size="lg" icon={<HeartHandshake className="h-5 w-5" />}>
                    Partner With Robotix
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                    Learn About The Institute
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
                {audiences.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/16 bg-white/[0.1] px-4 py-2 text-sm text-white/85 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7 }}
              className="relative"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-accent/20 via-transparent to-brand-secondary/20 blur-2xl" />
              <GlassCard className={`relative overflow-hidden rounded-[2rem] p-6 ${homeCard}`}>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/70 to-transparent" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-brand-accent">Institute Snapshot</p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold">
                      A real learning organization with public programs, partnerships, and student outcomes.
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-brand-accent/20 bg-brand-accent/10 p-3 text-brand-accent shadow-glow-accent">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {trustSignals.map((metric) => (
                    <div key={metric.label} className={`rounded-2xl border p-4 ${homePanel}`}>
                      <div className="text-xs uppercase tracking-[0.25em] text-white/45">{metric.label}</div>
                      <div className="mt-3 font-heading text-3xl font-bold text-white">{metric.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-white/18 bg-gradient-to-br from-white/[0.14] to-white/[0.06] p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/45">Public Contact Points</div>
                  <div className="mt-4 space-y-3">
                    {contacts.map((contact) => (
                      <a
                        key={contact.label}
                        href={contact.href}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm text-white/88 transition-colors hover:text-brand-accent ${homeInset}`}
                      >
                        <span>{contact.value}</span>
                        <ArrowRight className="h-4 w-4 text-brand-accent" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className={`rounded-[1.5rem] border p-5 ${homePanel}`}>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Headquarters</p>
                    <p className="mt-2 text-sm text-white/72">{robotixProfile.headquarters}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/20 bg-white/[0.11] p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Public Hours</p>
                    <p className="mt-2 text-sm text-white/72">{robotixProfile.openHours}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Section className="pt-8 pb-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge variant="accent" className="mb-4">Why Robotix Feels Credible</Badge>
            <h2 className="section-title">Professional trust comes from proof, not just ambition.</h2>
            <p className="section-subtitle mt-4">
              The homepage now emphasizes verified institute signals, public partnerships, and clear next steps for the people who actually use the site.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {robotixProfile.profileFacts.map((fact) => (
                <GlassCard key={fact.label} className={`p-5 ${homeCard}`}>
                  <div className="text-xs uppercase tracking-[0.24em] text-brand-accent">{fact.label}</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{fact.value}</div>
                  <div className="mt-2 text-sm text-white/50">{fact.source}</div>
                </GlassCard>
              ))}
            </div>
          </div>

          <GlassCard className={`p-6 ${homeCard}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Public proof points</p>
                <h3 className="mt-1 font-heading text-2xl font-semibold">Signals that matter to parents and schools</h3>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {proofPoints.map((point) => (
                <div key={point} className={`rounded-2xl border p-4 text-sm leading-6 text-white/78 ${homeInset}`}>
                  {point}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section withPattern className="pt-0 pb-8">
        <div className="mb-10 max-w-3xl">
          <Badge variant="accent" className="mb-4">Programs</Badge>
          <h2 className="section-title">Clear learning routes are more professional than a crowded front page.</h2>
          <p className="section-subtitle mt-4">
            These featured programs give visitors a fast understanding of who Robotix teaches and where to go next.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredPrograms.map((program) => (
            <GlassCard key={program.title} hover className={`h-full p-6 ${homeCard}`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                <GraduationCap className="h-6 w-6" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-secondary">{program.audience}</p>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-white">{program.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/62">{program.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="pt-0 pb-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-4">Get Started</Badge>
            <h2 className="section-title">A launch-ready homepage should route visitors quickly.</h2>
            <p className="section-subtitle mt-4">
              These entry points keep the site practical for families, students, and institutional partners.
            </p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-brand-accent hover:text-brand-accent-light">
            Contact the institute
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {accessRoutes.map((route) => (
            <Link key={route.title} href={route.href} className="group block h-full">
              <GlassCard hover className={`h-full p-6 ${homeCard}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-white/18 bg-white/18 p-3 text-brand-light">
                    <route.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-white/40 transition-colors group-hover:text-brand-accent">
                    Open
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold">{route.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{route.description}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0 pb-8">
        <PlayVerseShowcase />
      </Section>

      <Section className="pt-0 pb-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <GlassCard className={`p-6 ${homeCard}`}>
            <Badge variant="accent" className="mb-4">Partnership Signals</Badge>
            <h2 className="font-heading text-3xl font-bold">Schools and organizations need visible proof of collaboration.</h2>
            <div className="mt-6 space-y-3">
              {featuredPartnerships.map((partner) => (
                <div key={partner.name} className={`rounded-2xl border p-4 ${homeInset}`}>
                  <div className="font-semibold text-white">{partner.name}</div>
                  <p className="mt-2 text-sm leading-6 text-white/62">{partner.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className={`p-6 ${homeCard}`}>
            <Badge variant="accent" className="mb-4">Hands-On Work</Badge>
            <h2 className="font-heading text-3xl font-bold">Student and community work should stay visible on the homepage.</h2>
            <div className="mt-6 space-y-3">
              {buildStories.map((story) => (
                <div key={story.title} className={`rounded-2xl border p-4 ${homeInset}`}>
                  <div className="font-semibold text-white">{story.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/62">{story.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="pt-0 pb-8">
        <div className="mb-10 max-w-3xl">
          <Badge variant="accent" className="mb-4">Media Highlights</Badge>
          <h2 className="section-title">Real visuals make the homepage feel more alive and more trustworthy.</h2>
          <p className="section-subtitle mt-4">
            These public Robotix images and the official brand video give visitors a clearer feel for the learning environment, student builds, and classroom energy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {mediaHighlights.map((media, index) => (
              <GlassCard
                key={`${media.title}-${index}`}
                className={index === 0 ? `overflow-hidden p-0 md:col-span-2 ${homeCard}` : `overflow-hidden p-0 ${homeCard}`}
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={media.src}
                    alt={media.caption}
                    fill
                    className="object-cover"
                    sizes={index === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-brand-accent">Robotix moments</div>
                    <div className="mt-2 font-heading text-xl font-semibold text-white">{media.title}</div>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/72">{media.caption}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className={`overflow-hidden p-0 ${homeCard}`}>
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">Featured video</p>
                  <h3 className="mt-1 font-heading text-2xl font-semibold text-white">{robotixProfile.youtubeVideo.title}</h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/[0.08]">
                <div className="aspect-video">
                  <iframe
                    src={robotixProfile.youtubeVideo.embedUrl}
                    title={robotixProfile.youtubeVideo.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/65">
                This uses the public Robotix homepage video so the site gets richer media immediately without waiting on a separate social integration.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={robotixProfile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-white/82 transition-colors hover:text-brand-accent ${homeInset}`}
                >
                  <Instagram className="h-4 w-4" />
                  {robotixProfile.instagramHandle}
                </a>
                <a
                  href={robotixProfile.youtubeVideo.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-white/82 transition-colors hover:text-brand-accent ${homeInset}`}
                >
                  Watch on YouTube
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={robotixProfile.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-white/82 transition-colors hover:text-brand-accent ${homeInset}`}
                >
                  View official website media
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="pt-4">
        <GlassCard className={`overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14 ${homeCard}`}>
          <div className="aurora-bg absolute inset-0 opacity-70" />
          <div className="bg-grid absolute inset-0 opacity-10" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="accent" className="mb-4">Next Step</Badge>
              <h2 className="section-title">
                A better homepage makes it easier to trust Robotix, contact Robotix, and join Robotix.
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-white/68">
                Parents can enquire about weekend classes, schools can start partnership conversations, and students can explore public programs without feeling lost in the interface.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/weekend-classes">
                <Button variant="primary" size="lg" icon={<Rocket className="h-5 w-5" />}>
                  Start With Weekend Classes
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" icon={<Mail className="h-5 w-5" />}>
                  Contact The Institute
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </Section>

      <Footer />
    </main>
  );
}
