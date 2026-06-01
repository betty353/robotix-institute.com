import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge, Button, GlassCard, Section } from '@/components/ui';
import { robotixProfile } from '@/lib/robotix-profile';
import {
  featuredSchoolStories,
  schoolReferenceStories,
  schoolSpotlightStories,
} from '@/lib/school-stories';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock3,
  GraduationCap,
  Handshake,
  HeartHandshake,
  MapPin,
  RadioTower,
  School,
  Shield,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Schools & Partners' };

const partnerTypes = [
  {
    icon: School,
    title: 'Schools',
    desc: 'Clubs, coding pathways, camps, STEM enrichment, and robotics exposure inside classroom and after-school settings.',
  },
  {
    icon: HeartHandshake,
    title: 'NGOs & Access Programs',
    desc: 'Community-based initiatives for underserved learners, orphanages, and public-interest STEM access work.',
  },
  {
    icon: Building2,
    title: 'Corporate Partners',
    desc: 'Programs like the Stanbic-linked STEAM initiative show how brands can support practical youth technology education.',
  },
  {
    icon: RadioTower,
    title: 'Innovation Ecosystem',
    desc: 'BongoHive, Launcher Engineers\' Hub, expos, and showcase platforms help Robotix extend learning into the wider ecosystem.',
  },
] as const;

const schoolTimeline = [
  {
    date: 'June 9, 2020',
    title: 'French International School launch',
    detail:
      'Robotix publicly announced the start of coding and programming classes at the French International School in Lusaka.',
  },
  {
    date: '2024',
    title: 'Northmead pilot program',
    detail:
      'A five-month robotics and coding pilot introduced 40 Grade 5 learners to robotics, Tessa, and Tessa Blocks.',
  },
  {
    date: 'February 18, 2025',
    title: 'Impact recap references LICS',
    detail:
      'Robotix highlighted a Smart House Challenge at LICS as part of its wider school and innovation activity.',
  },
  {
    date: 'February 26, 2025',
    title: 'Stanbic partnership recognition',
    detail:
      'The Northmead program was highlighted again through Stanbic Bank Zambia\'s CSR and sustainability award coverage.',
  },
] as const;

const schoolHighlights = [
  {
    title: 'Hands-on learning first',
    detail:
      'Public Robotix coverage consistently frames the school programs around building, coding, and testing real projects rather than passive theory.',
  },
  {
    title: 'Access and inclusion',
    detail:
      'The Northmead and community-initiatives coverage shows Robotix using school partnerships to widen access to digital skills for learners who may not otherwise get that exposure.',
  },
  {
    title: 'Weekend-friendly flexibility',
    detail:
      'Robotix publicly lists Saturday to Wednesday, 10AM to 7PM as its opening hours, which gives families a realistic way to fit robotics and coding around busy school schedules.',
  },
] as const;

const schoolSignals = [
  ...featuredSchoolStories.map((story) => ({
    label: story.name,
    short: story.short,
    tone: story.status,
  })),
  ...schoolSpotlightStories.map((story) => ({
    label: story.name,
    short: story.short,
    tone: story.status,
  })),
  ...schoolReferenceStories.map((story) => ({
    label: story.name,
    short: story.short,
    tone: story.status,
  })),
] as const;

const collageImages = [
  {
    src: schoolSpotlightStories[0].imageSrc,
    alt: schoolSpotlightStories[0].imageAlt,
    title: 'AISL spotlight',
    note: 'International-school families looking for stronger STEM enrichment',
    className: 'lg:col-span-2',
  },
  {
    src: schoolSpotlightStories[1].imageSrc,
    alt: schoolSpotlightStories[1].imageAlt,
    title: 'ISL spotlight',
    note: 'Inquiry, creativity, and future-ready learning environments',
    className: '',
  },
  {
    src: featuredSchoolStories[1].imageSrc,
    alt: featuredSchoolStories[1].imageAlt,
    title: 'Real Robotix delivery',
    note: 'Hands-on robotics and coding with visible classroom energy',
    className: '',
  },
] as const;

const weekendReasons = [
  'Robotix publicly describes robotics classes as a strong after-school companion for curiosity, teamwork, and problem-solving.',
  'Public opening hours currently listed by Robotix: Sat - Wed, 10AM - 7PM.',
  'Weekend classes help children keep building confidence in coding, robotics, and creative technology even outside the school timetable.',
] as const;

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="aurora-bg absolute inset-0 opacity-80" />
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <Badge variant="accent" className="mb-4">
                <Handshake className="mr-1 h-3 w-3" />
                Schools & Partners
              </Badge>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">
                Schools, partners, and real reasons families choose Robotix.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                Public coverage already shows Robotix working with schools, community partners, and innovation
                spaces across Lusaka. This page brings those relationships into one clearer Robotix surface for
                families, institutions, and collaborators looking for practical STEM learning pathways.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/weekend-classes">
                  <Button icon={<ArrowRight className="h-4 w-4" />}>Ask about weekend classes</Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" icon={<Shield className="h-4 w-4" />}>
                    See verified profile
                  </Button>
                </Link>
              </div>
            </div>

            <GlassCard className="p-6 shine-effect">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Students trained', value: '2,500+' },
                  { label: 'Awards won', value: '6' },
                  { label: 'Weekend hours', value: 'Sat - Wed' },
                  { label: 'Open time', value: '10AM - 7PM' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/40">{item.label}</div>
                    <div className="mt-3 text-2xl font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Section className="py-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 stagger-children">
          {partnerTypes.map((partner) => (
            <GlassCard key={partner.title} className="p-6 shine-effect school-lift">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary">
                <partner.icon className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-xl font-semibold">{partner.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{partner.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <GlassCard className="overflow-hidden p-6 sm:p-8 noise-overlay">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge variant="accent" className="mb-3">
                <Sparkles className="mr-1 h-3 w-3" />
                School Network
              </Badge>
              <h2 className="font-heading text-3xl font-bold">
                A stronger school presence, told inside Robotix.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                Instead of sending people to an older external site, this page keeps the full story on Robotix:
                confirmed school work, international-school spotlights for Lusaka families, and a clearer
                weekend-class message for parents deciding where their children should learn next.
              </p>

              <div className="mt-6 marquee-shell">
                <div className="marquee-track">
                  {[...schoolSignals, ...schoolSignals].map((school, index) => (
                    <div
                      key={`${school.short}-${index}`}
                      className="marquee-item rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary/15 text-sm font-bold text-brand-secondary">
                          {school.short}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{school.label}</div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">
                            {school.tone}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid auto-rows-[160px] gap-4 sm:grid-cols-2">
              {collageImages.map((image, index) => (
                <div
                  key={image.title}
                  className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] ${image.className} ${index === 0 ? 'animate-float-slow' : ''}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-sm font-semibold text-white">{image.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">{image.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </Section>

      <Section className="py-8">
        <GlassCard className="p-6 sm:p-8 shine-effect">
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <Badge variant="accent" className="mb-3">
                <Clock3 className="mr-1 h-3 w-3" />
                Parent Fit
              </Badge>
              <h2 className="font-heading text-3xl font-bold">Weekend classes that work for busy families</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                Robotix publicly frames robotics as a strong after-school companion and lists weekend-friendly
                operating hours on its contact page. That makes it easier for parents to fit real STEM learning
                around school, sports, and family routines.
              </p>
            </div>
            <div className="grid gap-3">
              {weekendReasons.map((line) => (
                <div key={line} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/62 school-lift">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </Section>

      <Section className="py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              <School className="mr-1 h-3 w-3" />
              Confirmed Stories
            </Badge>
            <h2 className="font-heading text-3xl font-bold">Schools Robotix has publicly named in its own coverage</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              These are the clearest public school stories on Robotix&apos;s own site, with direct references to
              the school names and specific program details.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.22em] text-white/45">
            Verified from public posts through {robotixProfile.lastVerified}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 stagger-children">
          {featuredSchoolStories.map((school) => (
            <GlassCard key={school.slug} className="overflow-hidden p-0 shine-effect school-lift">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={school.imageSrc}
                  alt={school.imageAlt}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                <div className="absolute left-5 top-5">
                  <Badge variant="accent">{school.status}</Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {school.period}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {school.location}
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-2xl font-semibold">{school.name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{school.summary}</p>

                <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-brand-secondary">Why it matters</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{school.highlight}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/50">{school.imageCaption}</p>

                <div className="mt-5">
                  <Link href={`/partners/stories/${school.slug}`}>
                    <Button icon={<ArrowRight className="h-4 w-4" />}>Read school story</Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              <GraduationCap className="mr-1 h-3 w-3" />
              Parent Spotlights
            </Badge>
            <h2 className="font-heading text-3xl font-bold">
              International-school spotlights for Lusaka families
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              These profiles help parents imagine the kind of school communities where Robotix&apos;s weekend and
              after-school model feels especially relevant. They are school spotlights, not direct public
              partnership case-study posts from Robotix.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 stagger-children">
          {schoolSpotlightStories.map((school) => (
            <GlassCard key={school.slug} className="overflow-hidden p-0 shine-effect school-lift">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={school.imageSrc}
                  alt={school.imageAlt}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-3">
                  {school.logoSrc ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/90 p-2 shadow-lg shadow-black/20">
                      <Image
                        src={school.logoSrc}
                        alt={school.logoAlt ?? `${school.name} logo`}
                        width={112}
                        height={112}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <Badge variant="accent">{school.status}</Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {school.period}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {school.location}
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-2xl font-semibold">{school.name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{school.summary}</p>

                <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-brand-secondary">Parent angle</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{school.highlight}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/50">{school.imageCaption}</p>

                <div className="mt-5">
                  <Link href={`/partners/stories/${school.slug}`}>
                    <Button icon={<ArrowRight className="h-4 w-4" />}>Explore school spotlight</Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 shine-effect">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">School partnership timeline</h2>
            </div>
            <div className="space-y-4">
              {schoolTimeline.map((item, index) => (
                <div key={item.title} className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-4 pl-14 school-lift">
                  <div className="absolute left-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary/20 text-xs font-semibold text-brand-secondary">
                    {index + 1}
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/42">{item.date}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 shine-effect">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">What the public stories emphasize</h2>
            </div>
            <div className="space-y-4">
              {schoolHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 school-lift">
                  <div className="text-xs uppercase tracking-[0.2em] text-brand-secondary">Coverage signal</div>
                  <div className="mt-2 text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">Publicly visible partnership examples</h2>
            </div>
            <div className="space-y-3">
              {robotixProfile.partnerships.map((partner) => (
                <div
                  key={partner.name}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/60 school-lift"
                >
                  <span className="font-semibold text-white">
                    {partner.name.replaceAll('Ã¢â‚¬â„¢', '\'').replaceAll('â€™', '\'').replaceAll('’', '\'')}
                  </span>
                  <p className="mt-2 leading-6">{partner.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <School className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">What a school or partner can connect to</h2>
            </div>
            <div className="space-y-3">
              {[
                'Robotics clubs and age-based coding pathways from early learners to older students.',
                'Holiday camps, project showcases, and STEM activity programs.',
                'Community-oriented access work for underserved learners.',
                'Media and showcase opportunities through events, blogs, and ecosystem stories.',
                'Institutional visibility through the Robotix website, public showcases, and partnership storytelling.',
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/60 school-lift"
                >
                  {line}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">Additional school mentions in Robotix coverage</h2>
            </div>
            <div className="space-y-4">
              {schoolReferenceStories.map((item) => (
                <div key={item.slug} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 school-lift">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/42">{item.status}</div>
                  <div className="mt-2 text-base font-semibold text-white">{item.name}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.summary}</p>
                  <div className="mt-4">
                    <Link href={`/partners/stories/${item.slug}`}>
                      <Button variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>
                        Open internal summary
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">Why parents are drawn to Robotix</h2>
            </div>
            <div className="space-y-3">
              {[
                'Hands-on robotics, coding, and creative technology sessions that feel practical rather than abstract.',
                'A path that can work after school or on the weekend for families balancing strong academic schedules.',
                'Programs that build confidence, curiosity, teamwork, and future-ready digital skills.',
                'A mix of school-based delivery, camps, and community programs that makes Robotix feel both serious and accessible.',
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/60 school-lift"
                >
                  {line}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section className="py-8">
        <GlassCard className="p-8 text-center shine-effect">
          <Badge variant="accent" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            Partnership CTA
          </Badge>
          <h2 className="font-heading text-3xl font-bold">
            Ask Robotix about school programs, weekend classes, or your child&apos;s next STEM step
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Robotix publicly lists {robotixProfile.address}, info@robotixinstitute.io, +260 956 355 117, and
            open hours of Sat - Wed, 10AM - 7PM.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/weekend-classes">
              <Button>Explore weekend classes</Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary">Review company profile</Button>
            </Link>
          </div>
        </GlassCard>
      </Section>

      <Footer />
    </main>
  );
}
