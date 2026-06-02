import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge, Button, GlassCard, Section, SectionHeader } from '@/components/ui';
import { robotixProfile } from '@/lib/robotix-profile';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  Clock3,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Verified public profile for Robotix Institute ZM, including programs, partnerships, media, location, and contact details.',
};

const valueSignals = [
  {
    icon: Rocket,
    title: 'Hands-on learning model',
    desc: 'Robotix presents robotics, coding, and build-based learning as practical, project-led experiences instead of passive theory.',
  },
  {
    icon: GraduationCap,
    title: 'Structured learner pathways',
    desc: 'Programs are organized by learner stage, from early exposure to deeper text-based programming for older students.',
  },
  {
    icon: Users,
    title: 'Access and inclusion',
    desc: 'Public messaging consistently connects the institute’s work to underserved learners, community programs, and wider education access.',
  },
  {
    icon: Globe,
    title: 'Zambian innovation footprint',
    desc: 'The brand positions itself as a Lusaka-rooted STEM education and ecosystem partner for families, schools, NGOs, and companies.',
  },
] as const;

const quickActions = [
  {
    label: 'Visit official website',
    href: robotixProfile.website,
    external: true,
  },
  {
    label: 'Open LinkedIn company page',
    href: robotixProfile.linkedin,
    external: true,
  },
  {
    label: 'Contact Robotix',
    href: '/contact',
    external: false,
  },
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28 pb-14">
        <div className="absolute inset-0 aurora-bg opacity-80" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-5">
              Verified Public Profile
            </Badge>
            <h1 className="font-heading text-4xl font-bold leading-tight text-white lg:text-6xl">
              A stronger public profile for Robotix Institute ZM.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
              {robotixProfile.summary}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/56">
              {robotixProfile.publicFootprint}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <GlassCard className="p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Headquarters</div>
                <div className="mt-3 text-sm leading-6 text-white/78">{robotixProfile.headquarters}</div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Public hours</div>
                <div className="mt-3 text-sm leading-6 text-white/78">{robotixProfile.openHours}</div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Last verified</div>
                <div className="mt-3 text-sm leading-6 text-white/78">{robotixProfile.lastVerified}</div>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="shine-effect p-6 lg:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Public trust layer</p>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">Profile snapshot</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {robotixProfile.profileFacts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/38">{fact.label}</div>
                  <div className="mt-2 font-semibold text-white">{fact.value}</div>
                  <div className="mt-2 text-xs text-white/42">{fact.source}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {quickActions.map((action) => (
                action.external ? (
                  <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/76 transition-all hover:border-white/20 hover:text-brand-secondary"
                  >
                    <span>{action.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/76 transition-all hover:border-white/20 hover:text-brand-secondary"
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <Section className="py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {robotixProfile.impactStats.map((stat) => (
            <GlassCard key={stat.label} className="p-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">Impact signal</div>
              <div className="mt-4 font-heading text-4xl font-bold text-brand-accent">{stat.value}</div>
              <div className="mt-3 text-sm leading-6 text-white/66">{stat.label}</div>
              <div className="mt-3 text-xs text-white/38">{stat.source}</div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section withPattern className="py-8">
        <SectionHeader
          badge="Mission"
          title="What the institute appears to be building"
          subtitle={robotixProfile.mission}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {valueSignals.map((item) => (
            <GlassCard key={item.title} className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">Presence</div>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">Contact and location</h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-1 h-4 w-4 text-brand-secondary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/38">Headquarters</div>
                    <div className="mt-2 text-sm leading-6 text-white/78">{robotixProfile.headquarters}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-brand-secondary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/38">Address</div>
                    <div className="mt-2 text-sm leading-6 text-white/78">{robotixProfile.address}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-1 h-4 w-4 text-brand-secondary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/38">Open hours</div>
                    <div className="mt-2 text-sm leading-6 text-white/78">{robotixProfile.openHours}</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">Public channels</div>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">Direct contact points</h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {robotixProfile.contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-brand-secondary/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-white/38">{contact.label}</div>
                      <div className="mt-2 font-semibold text-white">{contact.value}</div>
                      <div className="mt-2 text-xs text-white/42">{contact.source}</div>
                    </div>
                    {contact.label.toLowerCase().includes('email') ? (
                      <Mail className="mt-1 h-4 w-4 text-brand-secondary" />
                    ) : (
                      <Phone className="mt-1 h-4 w-4 text-brand-secondary" />
                    )}
                  </div>
                </a>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="py-8">
        <SectionHeader
          badge="Programs"
          title="Learning pathways and public offers"
          subtitle="These tracks reflect the institute’s publicly described learner segments and delivery areas."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {robotixProfile.programs.map((program) => (
            <GlassCard key={program.title} className="p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">{program.audience}</div>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-white">{program.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{program.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">Ecosystem</div>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">Partnerships and ties</h2>
              </div>
            </div>
            <div className="space-y-3">
              {robotixProfile.partnerships.map((partner) => (
                <div key={partner.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-semibold text-white">{partner.name}</div>
                  <div className="mt-2 text-sm leading-6 text-white/58">{partner.detail}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">Work on the ground</div>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">Projects and community work</h2>
              </div>
            </div>
            <div className="space-y-3">
              {robotixProfile.projectsAndPlatforms.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-white/58">{item.detail}</div>
                </div>
              ))}
              {robotixProfile.communityWork.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="py-8">
        <SectionHeader
          badge="People"
          title="Publicly named leadership and team references"
          subtitle="This section only reflects names and roles surfaced in the public source set used for this profile."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {robotixProfile.people.map((person) => (
            <GlassCard key={person.name} className="group overflow-hidden p-0">
              <div className="relative h-full bg-white/[0.04] p-6">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-brand-primary/18 via-brand-secondary/12 to-transparent opacity-80" />
                <div className="relative flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-none overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/70 text-sm font-semibold text-white/75">
                      {person.name.split(' ').map((part) => part[0]).join('')}
                    </div>
                    {person.imageSrc ? (
                      <Image
                        src={person.imageSrc}
                        alt={`${person.name} profile`}
                        fill
                        sizes="80px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">{person.source}</div>
                    <h2 className="mt-3 font-heading text-2xl font-semibold text-white">{person.name}</h2>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-6 text-white/68">{person.role}</p>
                {person.linkedin ? (
                  <Link
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-secondary/50 hover:bg-brand-secondary/16"
                  >
                    View LinkedIn profile
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <SectionHeader
          badge="Timeline"
          title="Key public milestones"
          subtitle="A cleaner view of the dates and events that shape the institute’s public story."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {robotixProfile.milestones.map((item) => (
            <GlassCard key={`${item.date}-${item.title}`} className="p-6">
              <div className="flex items-center gap-2 text-brand-secondary">
                <Calendar className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">{item.date}</span>
              </div>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{item.detail}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <SectionHeader
          badge="Media"
          title="Official photos and video"
          subtitle="Public institute media adds visual proof points to the rest of the verified profile."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {robotixProfile.officialMedia.map((media) => (
            <GlassCard key={media.src} className="overflow-hidden p-0">
              <div className="relative aspect-[4/3]">
                <Image
                  src={media.src}
                  alt={media.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold text-white">{media.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{media.caption}</p>
                <a
                  href={media.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-secondary transition hover:text-brand-accent"
                >
                  View source
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6 overflow-hidden p-0">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">Video profile</div>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">{robotixProfile.youtubeVideo.title}</h2>
              </div>
            </div>
          </div>
          <div className="overflow-hidden border-y border-white/10">
            <div className="aspect-video">
              <iframe
                src={robotixProfile.youtubeVideo.embedUrl}
                title={robotixProfile.youtubeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 px-6 py-5">
            <a href={robotixProfile.youtubeVideo.watchUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
                Watch on YouTube
              </Button>
            </a>
            <a href={robotixProfile.website} target="_blank" rel="noreferrer">
              <Button icon={<ExternalLink className="h-4 w-4" />}>
                Open official homepage
              </Button>
            </a>
          </div>
        </GlassCard>
      </Section>

      <Section className="py-8">
        <GlassCard className="p-8">
          <SectionHeader
            centered={false}
            badge="Sources"
            title="Where this profile came from"
            subtitle="This page is built from public Robotix sources and public partner coverage, then organized into one cleaner institute profile."
          />
          <div className="grid gap-3 md:grid-cols-2">
            {robotixProfile.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-brand-secondary/30 hover:bg-white/[0.05]"
              >
                <span className="text-sm text-white/76">{source.label}</span>
                <ExternalLink className="h-4 w-4 flex-none text-brand-secondary" />
              </a>
            ))}
          </div>
        </GlassCard>
      </Section>

      <Section className="pt-8 pb-14">
        <GlassCard className="p-10 text-center">
          <Badge variant="accent" className="mb-4">
            Next Step
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-white">
            Use this page as the trust anchor for the rest of the website.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            The profile now reads more like a serious institute page, with clearer sections for mission, proof points,
            contact channels, partnerships, programs, and official media.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/partners">
              <Button icon={<Building2 className="h-4 w-4" />}>See partnership surface</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" icon={<Mail className="h-4 w-4" />}>Contact Robotix</Button>
            </Link>
          </div>
        </GlassCard>
      </Section>

      <Footer />
    </main>
  );
}
