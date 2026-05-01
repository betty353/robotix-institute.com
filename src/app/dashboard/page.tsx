'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, ProgressBar, EmptyState, LoadingSpinner } from '@/components/ui';
import { useAuth, useApi } from '@/hooks/useApi';
import {
  GraduationCap, Code, Trophy, Bell, BookOpen, Cpu,
  ArrowRight, Calendar, Award, Sparkles, Rocket, Gamepad2
} from 'lucide-react';

interface MeData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  /** Institute gamification lifetime points */
  points?: number;
  createdAt: string;
  _count?: {
    enrollments: number;
    codeProjects: number;
    robotProjects: number;
    forumPosts: number;
    certificates: number;
    achievements: number;
  };
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { get } = useApi();
  const [me, setMe] = useState<MeData | null>(null);
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const [meRes, notifs, enrolls] = await Promise.all([
          get<MeData>('/auth/me'),
          get<{ notifications: any[] }>('/notifications?limit=5').catch(() => null),
          get<{ enrollments: any[] }>('/enrollments?limit=4').catch(() => null),
        ]);
        if (meRes?.data) setMe(meRes.data);
        if (notifs?.data?.notifications) setRecentNotifs(notifs.data.notifications);
        if (enrolls?.data?.enrollments) setEnrollments(enrolls.data.enrollments);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, get]);

  if (!isAuthenticated) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <Navbar />
        <Section className="pt-32">
          <EmptyState
            icon={<GraduationCap className="w-8 h-8" />}
            title="Sign in to see your dashboard"
            description="Track your courses, projects, achievements and notifications all in one place."
            action={<Link href="/login"><Button>Sign In</Button></Link>}
          />
        </Section>
        <Footer />
      </main>
    );
  }

  const counts = me?._count || { enrollments: 0, codeProjects: 0, robotProjects: 0, forumPosts: 0, certificates: 0, achievements: 0 };

  const quickStats = [
    { label: 'Courses', value: counts.enrollments, icon: BookOpen, href: '/courses', color: 'from-blue-500 to-indigo-500' },
    { label: 'Code Projects', value: counts.codeProjects, icon: Code, href: '/playground', color: 'from-green-500 to-emerald-500' },
    { label: 'Robot Projects', value: counts.robotProjects, icon: Cpu, href: '/projects', color: 'from-purple-500 to-violet-500' },
    { label: 'Achievements', value: counts.achievements, icon: Award, href: '/portfolio', color: 'from-yellow-500 to-orange-500' },
  ];

  const quickActions = [
    { label: 'Continue Learning', desc: 'Resume your last course', href: '/courses', icon: BookOpen },
    { label: 'Open Coder Station', desc: 'Write & run code', href: '/playground', icon: Code },
    { label: 'Game Lab', desc: 'Phaser games in the browser', href: '/game-lab', icon: Gamepad2 },
    { label: 'Game Arena', desc: 'Compete & climb the leaderboard', href: '/arena', icon: Trophy },
    { label: 'Build Portfolio', desc: 'Showcase your robotics projects', href: '/portfolio', icon: Sparkles },
  ];

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="pt-28 pb-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="accent">
                <Sparkles className="w-3 h-3 mr-1" /> Welcome back
              </Badge>
              {typeof me?.points === 'number' ? (
                <Link href="/arena">
                  <Badge variant="primary" className="cursor-pointer hover:opacity-90">
                    ✨ {me.points.toLocaleString()} institute pts
                  </Badge>
                </Link>
              ) : null}
            </div>
            <h1 className="font-heading text-3xl font-bold text-white">
              Hi {user?.firstName || 'there'} 👋
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Here's what's happening with your learning today.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          {/* Quick stats */}
          <Section className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, i) => (
                <Link key={stat.label} href={stat.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassCard hover className="p-5">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                    </GlassCard>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Section>

          <Section className="py-8 grid lg:grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-semibold text-white flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-brand-accent" /> Quick Actions
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.map((a) => (
                    <Link key={a.href} href={a.href}>
                      <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                            <a.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white group-hover:text-brand-accent transition-colors">
                              {a.label}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">{a.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-brand-accent transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassCard>

              {/* Active courses */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-accent" /> Continue Learning
                  </h2>
                  <Link href="/courses" className="text-xs text-brand-accent hover:underline">All courses</Link>
                </div>
                {enrollments.length === 0 ? (
                  <EmptyState
                    icon={<GraduationCap className="w-8 h-8" />}
                    title="No active enrollments yet"
                    description="Browse our catalog and enroll in your first robotics course."
                    action={<Link href="/courses"><Button size="sm">Browse Courses</Button></Link>}
                  />
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((e) => (
                      <Link key={e.id} href={`/courses/${e.course?.slug || ''}`}>
                        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-white">{e.course?.title || 'Course'}</p>
                            <span className="text-xs text-white/40">{Math.round((e.progress || 0) * 100)}%</span>
                          </div>
                          <ProgressBar value={(e.progress || 0) * 100} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Notifications */}
            <div>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-semibold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-accent" /> Recent
                  </h2>
                  <Link href="/notifications" className="text-xs text-brand-accent hover:underline">All</Link>
                </div>
                {recentNotifs.length === 0 ? (
                  <p className="text-sm text-white/40 text-center py-6">You're all caught up! 🎉</p>
                ) : (
                  <div className="space-y-3">
                    {recentNotifs.map((n: any) => (
                      <Link key={n.id} href={n.link || '#'} className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-sm font-medium text-white line-clamp-1">{n.title}</p>
                        <p className="text-xs text-white/50 line-clamp-2 mt-1">{n.message}</p>
                        <p className="text-[10px] text-white/30 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </Section>
        </>
      )}

      <Footer />
    </main>
  );
}
