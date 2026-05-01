'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3, BookOpen, Code, Trophy, Award, Clock,
  MessageCircle, GraduationCap, Gamepad2, TrendingUp,
  Star, Zap, Target, Medal, ArrowUpRight, Brain
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Section, SectionHeader, GlassCard, Badge, Button,
  LoadingSpinner, ProgressBar
} from '@/components/ui';
import { StatSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  const { isAuthenticated, user, token } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('/api/analytics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-brand-dark text-white">
        <Navbar />
        <div className="pt-32 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h1 className="text-2xl font-heading font-bold mb-4">Sign In to View Analytics</h1>
          <p className="text-white/50 mb-6">Track your learning progress and achievements</p>
          <Link href="/login"><Button>Sign In</Button></Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-dark text-white">
        <Navbar />
        <div className="pt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </main>
    );
  }

  const overview = data?.overview || {};

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      {/* Header */}
      <section className="relative pt-28 pb-8">
        <div className="absolute inset-0 circuit-overlay opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="accent" className="mb-4">📊 My Analytics</Badge>
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.firstName}</span>
            </h1>
            <p className="text-lg text-white/50">Here&apos;s your learning journey at a glance.</p>
          </motion.div>
        </div>
      </section>

      {/* Overview Stats */}
      <Section className="pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {[
            { label: 'Enrolled Courses', value: overview.totalEnrolled || 0, icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Completed', value: overview.completedCourses || 0, icon: <GraduationCap className="w-5 h-5" />, color: 'text-green-400' },
            { label: 'Code Projects', value: overview.codeProjects || 0, icon: <Code className="w-5 h-5" />, color: 'text-purple-400' },
            { label: 'Achievements', value: overview.achievementCount || 0, icon: <Award className="w-5 h-5" />, color: 'text-yellow-400' },
            { label: 'Total Points', value: overview.totalPoints || 0, icon: <Star className="w-5 h-5" />, color: 'text-brand-accent' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Quiz Performance */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <GlassCard className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-semibold text-white">Quiz Performance</h3>
              </div>
              <div className="text-center py-6">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="url(#quizGradient)" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(overview.avgQuizScore || 0) * 3.14} 314`}
                    />
                    <defs>
                      <linearGradient id="quizGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f0ff" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-3xl font-heading font-bold text-white">{overview.avgQuizScore || 0}%</div>
                    <div className="text-[10px] text-white/40">AVG SCORE</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{overview.certificates || 0}</div>
                  <div className="text-[10px] text-white/40">Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{overview.topGameScore || 0}</div>
                  <div className="text-[10px] text-white/40">Top Game Score</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Skills Radar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <GlassCard className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-400" />
                <h3 className="font-heading font-semibold text-white">Skills</h3>
              </div>
              <div className="space-y-3">
                {(data?.skills || []).map((skill: any) => (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/70">{skill.skill}</span>
                      <span className="text-white/40">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-secondary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <GlassCard className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="font-heading font-semibold text-white">Weekly Activity</h3>
              </div>
              <div className="flex items-end justify-between gap-2 h-40 pt-4">
                {(data?.weeklyActivity || []).map((week: any, i: number) => {
                  const maxLessons = Math.max(...(data?.weeklyActivity || []).map((w: any) => w.lessons), 1);
                  const height = Math.max(10, (week.lessons / maxLessons) * 100);
                  return (
                    <div key={week.week} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-brand-accent/30 to-brand-accent/80 min-h-[8px]"
                      />
                      <span className="text-[10px] text-white/40">{week.week}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-white/40">
                <span>Lessons completed per week</span>
                <span className="flex items-center gap-1 text-green-400">
                  <ArrowUpRight className="w-3 h-3" /> Active
                </span>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Course Progress */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="font-heading font-semibold text-white">Course Progress</h3>
                </div>
                <Link href="/courses" className="text-xs text-brand-accent hover:underline">View All</Link>
              </div>
              {(data?.enrollments || []).length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No courses enrolled yet
                </div>
              ) : (
                <div className="space-y-4">
                  {(data?.enrollments || []).slice(0, 5).map((e: any) => (
                    <div key={e.id}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-white/80 truncate flex-1">{e.course.title}</span>
                        <span className={`text-xs ml-2 ${e.completed ? 'text-green-400' : 'text-white/40'}`}>
                          {e.completed ? 'Completed' : `${Math.round(e.progress)}%`}
                        </span>
                      </div>
                      <ProgressBar value={e.completed ? 100 : e.progress} />
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-heading font-semibold text-white">Achievements</h3>
                </div>
                <span className="text-xs text-white/40">{overview.achievementCount || 0} earned</span>
              </div>
              {(data?.achievements || []).length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  <Award className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No achievements yet. Start learning to earn badges!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(data?.achievements || []).slice(0, 6).map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="text-2xl">{a.icon}</div>
                      <div>
                        <p className="text-xs font-medium text-white">{a.name}</p>
                        <p className="text-[10px] text-white/40">+{a.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Learning Paths & Game Scores */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <h3 className="font-heading font-semibold text-white">Learning Paths</h3>
                </div>
                <Link href="/paths" className="text-xs text-brand-accent hover:underline">Browse Paths</Link>
              </div>
              {(data?.pathEnrollments || []).length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No paths started yet
                </div>
              ) : (
                <div className="space-y-3">
                  {(data?.pathEnrollments || []).map((pe: any) => (
                    <Link key={pe.id} href={`/paths/${pe.learningPath.slug}`} className="block">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-sm text-white/80">{pe.learningPath.title}</span>
                        <Badge variant={pe.completed ? 'success' : 'accent'}>
                          {pe.completed ? 'Done' : `Step ${pe.currentStep}`}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-pink-400" />
                  <h3 className="font-heading font-semibold text-white">Top Game Scores</h3>
                </div>
                <Link href="/arena" className="text-xs text-brand-accent hover:underline">Play Games</Link>
              </div>
              {(data?.gameScores || []).length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No game scores yet. Visit the arena!
                </div>
              ) : (
                <div className="space-y-2">
                  {(data?.gameScores || []).slice(0, 5).map((gs: any, i: number) => (
                    <div
                      key={gs.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white/20">#{i + 1}</span>
                        <div>
                          <p className="text-sm text-white/80">{gs.game.name}</p>
                          <p className="text-[10px] text-white/40">Level {gs.level}</p>
                        </div>
                      </div>
                      <span className="text-sm font-heading font-bold text-brand-accent">{gs.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Course Distribution */}
        {(data?.coursesByCategory || []).length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.9 }} className="mt-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-semibold text-white">Courses by Category</h3>
              </div>
              <div className="flex items-end gap-4 h-40">
                {(data?.coursesByCategory || []).map((cat: any, i: number) => {
                  const max = Math.max(...(data?.coursesByCategory || []).map((c: any) => c.value), 1);
                  const height = Math.max(15, (cat.value / max) * 100);
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500'];
                  return (
                    <div key={cat.name} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-white">{cat.value}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`w-full rounded-t-lg ${colors[i % colors.length]} opacity-70 min-h-[8px]`}
                      />
                      <span className="text-[9px] text-white/40 text-center leading-tight">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </Section>

      <Footer />
    </main>
  );
}
