'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Flame,
  Gamepad2,
  Gauge,
  Rocket,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthGate } from '@/components/learning/AuthGate';
import { FirebaseLoginCard } from '@/components/learning/FirebaseLoginCard';
import { useLearningProfile } from '@/components/learning/useLearningProfile';
import { Badge, Button, GlassCard, ProgressBar, Section } from '@/components/ui';
import { familySignals, onboardingTracks } from '@/lib/ecosystem-data';
import { learningPaths } from '@/lib/learning-data';

export default function DashboardPage() {
  const {
    profile,
    level,
    levelProgress,
    badges,
    completedCount,
    totalLessons,
    nextLesson,
  } = useLearningProfile();

  const statCards = [
    { label: 'XP signal', value: profile.xp.toLocaleString(), icon: Sparkles },
    { label: 'Innovation level', value: level, icon: Gauge },
    { label: 'Learning streak', value: `${profile.streak} days`, icon: Flame },
    { label: 'Lessons completed', value: `${completedCount}/${totalLessons}`, icon: BookOpen },
  ];

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="aurora-bg absolute inset-0 opacity-80" />
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div>
              <Badge variant="accent" className="mb-4">
                <Trophy className="mr-1 h-3 w-3" />
                Digital Identity
              </Badge>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">
                Your innovation identity across learning, building, gaming, and creation.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                This dashboard is designed as a future-facing identity layer, closer to GitHub plus LinkedIn plus Roblox than a normal student profile page.
              </p>
            </div>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-brand-secondary">Identity signal</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">Progress should feel visible and valuable.</h2>
                </div>
                <Shield className="h-6 w-6 text-brand-secondary" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Portfolio mode', value: 'Building' },
                  { label: 'Community path', value: 'Connected' },
                  { label: 'Creator state', value: 'Active' },
                  { label: 'Next unlock', value: 'In motion' },
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

      <AuthGate>
        <Section className="py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-5">
                  <stat.icon className="mb-3 h-6 w-6 text-brand-secondary" />
                  <p className="font-heading text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/45">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section className="py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-2xl font-bold">Level progression</h2>
                    <p className="text-sm text-white/50">A visible innovation ladder from beginner to advanced.</p>
                  </div>
                  <Badge variant="primary">{level}</Badge>
                </div>
                <ProgressBar value={levelProgress} showLabel />
              </GlassCard>

              <GlassCard className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-2xl font-bold">Learning pathways</h2>
                    <p className="text-sm text-white/50">Track your robotics, AI, programming, and creator momentum.</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-brand-secondary" />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {learningPaths.map((path) => {
                    const completed = path.lessons.filter((lesson) => profile.completedLessonIds.includes(lesson.id)).length;
                    const progress = Math.round((completed / path.lessons.length) * 100);
                    const Icon = path.icon;
                    return (
                      <Link key={path.slug} href={path.href} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
                        <div className="mb-3 flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${path.accent}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{path.shortTitle}</p>
                            <p className="text-xs text-white/40">{completed}/{path.lessons.length} lessons</p>
                          </div>
                        </div>
                        <ProgressBar value={progress} />
                      </Link>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            <aside className="space-y-5">
              <FirebaseLoginCard />

              <GlassCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-brand-secondary" />
                  <h2 className="font-heading text-lg font-bold">Recommended next move</h2>
                </div>
                <p className="font-semibold text-white">{nextLesson.title}</p>
                <p className="mt-1 text-sm text-white/50">{nextLesson.pathTitle}</p>
                <Link href={`/learn/${nextLesson.pathSlug}`}>
                  <Button className="mt-4 w-full justify-center">Continue lesson</Button>
                </Link>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-secondary" />
                  <h2 className="font-heading text-lg font-bold">Achievements</h2>
                </div>
                {badges.length === 0 ? (
                  <p className="text-sm text-white/50">Complete a lesson to earn your first visible achievement.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge) => <Badge key={badge} variant="accent">{badge}</Badge>)}
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-5">
                <p className="mb-3 font-heading font-semibold">Quick launch</p>
                <div className="grid gap-2">
                  <Link href="/onboarding" className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-sm text-white/70 transition-colors hover:text-white">
                    <Shield className="mr-2 inline h-4 w-4" /> Personalized onboarding
                  </Link>
                  <Link href="/learn" className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-sm text-white/70 transition-colors hover:text-white">Learning paths</Link>
                  <Link href="/play" className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-sm text-white/70 transition-colors hover:text-white">
                    <Gamepad2 className="mr-2 inline h-4 w-4" /> PlayVerse
                  </Link>
                  <Link href="/build" className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-sm text-white/70 transition-colors hover:text-white">
                    <BrainCircuit className="mr-2 inline h-4 w-4" /> AI Builder
                  </Link>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-secondary" />
                  <h2 className="font-heading text-lg font-bold">Parent mode</h2>
                </div>
                <div className="space-y-3">
                  {familySignals.map((signal) => (
                    <div key={signal.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="text-sm font-medium text-white">{signal.title}</p>
                      <p className="mt-1 text-xs text-white/50">{signal.detail}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </aside>
          </div>
        </Section>

        <Section className="py-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {onboardingTracks.map((track) => (
              <GlassCard key={track.id} className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-secondary">{track.id}</p>
                <h3 className="mt-3 font-heading text-lg font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm text-white/55">{track.summary}</p>
                <Link href={track.destination} className="mt-4 inline-flex text-sm font-semibold text-brand-accent">
                  Open lane
                </Link>
              </GlassCard>
            ))}
          </div>
        </Section>
      </AuthGate>
      <Footer />
    </main>
  );
}
