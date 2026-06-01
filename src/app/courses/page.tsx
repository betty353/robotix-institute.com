'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge, Button, GlassCard, Input, Section } from '@/components/ui';
import { robotixProfile } from '@/lib/robotix-profile';
import { challengeArcs, connectivityModes, languageRoadmap } from '@/lib/ecosystem-data';
import {
  ArrowRight,
  Bot,
  Cpu,
  Filter,
  Gamepad2,
  GraduationCap,
  Rocket,
  Search,
  Shield,
  Sprout,
  Star,
  Telescope,
  Wifi,
} from 'lucide-react';

const sectors = [
  {
    id: 'little-einsteins',
    slug: 'robotics-fundamentals',
    title: 'Little Einsteins',
    category: 'Pre-elementary',
    level: 'Beginner',
    duration: 'Starter pathway',
    energy: 'Discovery lane',
    icon: Cpu,
    accent: 'from-brand-secondary via-brand-accent to-brand-primary',
    description: 'Early robotics exposure using playful, hands-on learning with LEGO robots and Scratch Junior style activities.',
    outcomes: ['Explore robots', 'Learn simple logic', 'Build confidence through play'],
  },
  {
    id: 'byte-buddies',
    slug: 'arduino-robotics',
    title: 'Byte Buddies',
    category: 'Elementary',
    level: 'Beginner',
    duration: 'Ages 7-10',
    energy: 'Foundation lane',
    icon: Wifi,
    accent: 'from-emerald-400 via-brand-secondary to-brand-primary',
    description: 'Foundational robotics and coding for younger school-age learners moving from curiosity into structured STEM habits.',
    outcomes: ['Understand sequences', 'Build beginner projects', 'Start coding with confidence'],
  },
  {
    id: 'imagineering',
    slug: 'ai-robotics',
    title: 'Imagineering',
    category: 'High school',
    level: 'Intermediate',
    duration: 'Ages 11-14',
    energy: 'Builder lane',
    icon: Bot,
    accent: 'from-brand-accent via-fuchsia-500 to-brand-secondary',
    description: 'Project-based robotics, sensors, drones, AI, IoT, and text-based coding for learners stepping into deeper technical work.',
    outcomes: ['Use sensors', 'Prototype smart systems', 'Blend code with robotics'],
  },
  {
    id: 'code-quest',
    slug: 'game-development',
    title: 'Code Quest',
    category: 'Script-based coding',
    level: 'Advanced',
    duration: 'Ages 15-18',
    energy: 'Creator lane',
    icon: Gamepad2,
    accent: 'from-brand-accent via-amber-300 to-orange-400',
    description: 'Programming-focused pathway for older learners ready for deeper scripting, logic, and project execution.',
    outcomes: ['Write real code', 'Build portfolio projects', 'Prepare for advanced innovation work'],
  },
  {
    id: 'camps',
    slug: 'smart-agriculture-automation',
    title: 'Camps',
    category: 'Seasonal programs',
    level: 'Intermediate',
    duration: 'All ages',
    energy: 'Momentum lane',
    icon: Sprout,
    accent: 'from-lime-400 via-emerald-400 to-brand-secondary',
    description: 'Holiday and school-break programs covering robotics, programming, STEM, and game development in intensive short bursts.',
    outcomes: ['Ship projects faster', 'Join team activities', 'Grow interest through immersion'],
  },
  {
    id: 'community-initiatives',
    slug: 'innovation-leadership',
    title: 'Community-Based Initiatives',
    category: 'Access programs',
    level: 'Intermediate',
    duration: 'Partner-based',
    energy: 'Impact lane',
    icon: Rocket,
    accent: 'from-slate-400 via-brand-primary to-brand-accent',
    description: 'Programs for underserved learners, partner schools, and community groups designed to widen access to robotics and digital skills.',
    outcomes: ['Expand access', 'Support schools', 'Deliver practical STEM exposure'],
  },
] as const;

const levelFilters = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<(typeof levelFilters)[number]>('All');

  const filteredSectors = useMemo(() => {
    return sectors.filter((sector) => {
      const matchesSearch =
        sector.title.toLowerCase().includes(search.toLowerCase()) ||
        sector.description.toLowerCase().includes(search.toLowerCase()) ||
        sector.category.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = selectedLevel === 'All' || sector.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [search, selectedLevel]);

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
                <GraduationCap className="mr-1 h-3 w-3" />
                Robotix Programs
              </Badge>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">
                Explore Robotix through real public learning pathways.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                This page reflects the public program structure Robotix presents: Little Einsteins, Byte Buddies, Imagineering, Code Quest, camps, and community-based initiatives.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/about">
                  <Button icon={<Telescope className="h-4 w-4" />}>See institute profile</Button>
                </Link>
                <Link href="/onboarding">
                  <Button variant="secondary" icon={<Shield className="h-4 w-4" />}>Personalize my route</Button>
                </Link>
              </div>
            </div>

            <GlassCard className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Public programs', value: robotixProfile.programs.length.toString() },
                  { label: 'Students trained', value: '2,500+' },
                  { label: 'Awards won', value: '6' },
                  { label: 'Founded', value: '2020' },
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <Input
              placeholder="Search sectors, missions, or categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {levelFilters.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedLevel === level
                    ? 'bg-brand-secondary text-white'
                    : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-4">
        <div className="mb-6 flex items-center gap-2 text-sm text-white/50">
          <Filter className="h-4 w-4 text-brand-secondary" />
          {filteredSectors.length} program pathways available
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/courses/${sector.slug}`}>
                  <GlassCard hover className="flex h-full flex-col p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${sector.accent}`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-right">
                        <Badge variant={sector.level === 'Advanced' ? 'danger' : sector.level === 'Intermediate' ? 'accent' : 'success'}>
                          {sector.level}
                        </Badge>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">{sector.energy}</p>
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">{sector.category}</p>
                    <h2 className="mt-2 font-heading text-2xl font-bold">{sector.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-white/60">{sector.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {sector.outcomes.map((outcome) => (
                        <span key={outcome} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                          {outcome}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                      <span className="text-white/45">{sector.duration}</span>
                      <span className="inline-flex items-center gap-2 font-semibold text-brand-accent">
                        Enter sector <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">Challenge arcs</h2>
            </div>
            <div className="space-y-3">
              {challengeArcs.map((challenge) => (
                <div key={challenge.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{challenge.title}</p>
                    <Badge variant="accent">{challenge.xp}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-white/58">{challenge.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wifi className="h-5 w-5 text-brand-secondary" />
              <h2 className="font-heading text-2xl font-bold">Access architecture</h2>
            </div>
            <div className="space-y-3">
              {connectivityModes.map((mode) => (
                <div key={mode.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{mode.title}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-brand-secondary">{mode.signal}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/58">{mode.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-brand-secondary/20 bg-brand-secondary/10 p-4 text-sm text-white/68">
              The learning layer is now ready to be framed for premium immersive users and for lower-bandwidth school contexts without changing the brand.
            </div>
          </GlassCard>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
