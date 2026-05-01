'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, LoadingSpinner, EmptyState } from '@/components/ui';
import { Gamepad2, Trophy, Star, Users, Target, Medal, Crown, Sparkles } from 'lucide-react';

interface ApiGame {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  difficulty: string;
  maxScore: number;
  thumbnail?: string;
  levels: { id: string; levelNum: number; name: string; maxScore: number }[];
  _count: { scores: number };
}

interface LeaderboardEntry {
  user: { id: string; firstName: string; lastName: string; avatar?: string };
  score: number;
  game?: { name: string };
}

interface InstituteLbEntry {
  rank: number;
  points: number;
  user: { id: string; firstName: string; lastName: string; avatar?: string | null };
  isMe?: boolean;
}

const FALLBACK_GAMES: ApiGame[] = [
  {
    id: 'fallback-1', name: 'Robot Maze Challenge', slug: 'robot-maze',
    description: 'Navigate your robot through increasingly complex mazes. Use algorithms to find the shortest path.',
    type: 'maze', difficulty: 'medium', maxScore: 1000,
    levels: [{ id: 'l1', levelNum: 1, name: 'Warm-up', maxScore: 1000 }],
    _count: { scores: 0 },
  },
];

const TYPE_META: Record<string, { icon: string; gradient: string }> = {
  maze: { icon: '🏗️', gradient: 'from-purple-500/20 to-blue-500/20' },
  line_follower: { icon: '📏', gradient: 'from-green-500/20 to-emerald-500/20' },
  drone_nav: { icon: '🚁', gradient: 'from-cyan-500/20 to-sky-500/20' },
  robot_soccer: { icon: '⚽', gradient: 'from-orange-500/20 to-red-500/20' },
};

const ACHIEVEMENTS = [
  { name: 'First Steps', icon: '🏅', desc: 'Complete your first game', points: 10 },
  { name: 'Speed Runner', icon: '⚡', desc: 'Complete a level under 30 seconds', points: 25 },
  { name: 'Perfect Score', icon: '💯', desc: 'Get maximum score on any level', points: 50 },
  { name: 'Maze Master', icon: '🧩', desc: 'Complete all maze levels', points: 100 },
  { name: 'Code Warrior', icon: '⚔️', desc: 'Win 10 games in a row', points: 75 },
  { name: 'Legend', icon: '👑', desc: 'Reach the top of the leaderboard', points: 200 },
];

function asArray<T>(x: unknown): T[] {
  return Array.isArray(x) ? (x as T[]) : [];
}

export default function ArenaPage() {
  const [tab, setTab] = useState<'games' | 'leaderboard' | 'achievements'>('games');
  const [games, setGames] = useState<ApiGame[] | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardBoard, setLeaderboardBoard] = useState<'arena' | 'institute'>('arena');
  const [pointsPeriod, setPointsPeriod] = useState<'all' | 'weekly'>('all');
  const [instituteRows, setInstituteRows] = useState<InstituteLbEntry[]>([]);
  const [instituteLoading, setInstituteLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [gamesRes, lbRes] = await Promise.all([
          fetch('/api/games?limit=20').then((r) => r.json()).catch(() => null),
          fetch('/api/leaderboard?limit=10').then((r) => r.json()).catch(() => null),
        ]);
        if (cancelled) return;
        const fromData = asArray<ApiGame>(gamesRes?.data);
        const fromItems = asArray<ApiGame>(gamesRes?.items);
        const fetched = fromData.length > 0 ? fromData : fromItems;
        setGames(fetched.length > 0 ? fetched : FALLBACK_GAMES);
        const lbRaw = lbRes?.data?.leaderboard ?? lbRes?.data;
        setLeaderboard(asArray<LeaderboardEntry>(lbRaw));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadPoints() {
      if (tab !== 'leaderboard' || leaderboardBoard !== 'institute') return;
      setInstituteLoading(true);
      try {
        const qs = pointsPeriod === 'weekly' ? 'period=weekly&limit=50' : 'period=all&limit=50';
        const res = await fetch(`/api/leaderboard/users?${qs}`, { credentials: 'include' });
        const json = await res.json();
        if (cancelled) return;
        const rows = json?.data?.leaderboard;
        setInstituteRows(Array.isArray(rows) ? rows : []);
      } catch {
        if (!cancelled) setInstituteRows([]);
      } finally {
        if (!cancelled) setInstituteLoading(false);
      }
    }
    loadPoints();
    return () => { cancelled = true; };
  }, [tab, leaderboardBoard, pointsPeriod]);

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="circuit-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="accent" className="mb-4">
              <Gamepad2 className="w-3 h-3 mr-1" /> Gamified Learning
            </Badge>
            <h1 className="section-title mb-4">
              Robotics <span className="gradient-text">Game Arena</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Challenge yourself with fun robotics games. Compete with students across Zambia and climb the leaderboard.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="py-8">
        <div className="flex gap-2 mb-8">
          {[
            { key: 'games' as const, label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
            { key: 'leaderboard' as const, label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
            { key: 'achievements' as const, label: 'Achievements', icon: <Medal className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-medium text-sm transition-all ${
                tab === t.key
                  ? 'bg-brand-accent text-brand-dark'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner />}

        {!loading && tab === 'games' && (
          <div className="grid md:grid-cols-2 gap-6">
            {games && games.length > 0 ? (
              games.map((g, i) => {
                const levels = Array.isArray(g.levels) ? g.levels : [];
                const scoreCount = g._count && typeof g._count.scores === 'number' ? g._count.scores : 0;
                const meta = TYPE_META[g.type] || { icon: '🎮', gradient: 'from-white/10 to-white/5' };
                return (
                  <motion.div
                    key={g.id || g.slug || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <GlassCard hover className="p-6 h-full">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-3xl shrink-0`}>
                          {meta.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-heading text-lg font-semibold text-white">{g.name}</h3>
                            <Badge variant={g.difficulty === 'easy' ? 'success' : g.difficulty === 'hard' ? 'danger' : 'accent'}>
                              {g.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/50 mb-4">{g.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-4">
                            <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {levels.length} levels</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {g.maxScore} max</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {scoreCount}</span>
                          </div>
                          <Link href={`/arena/${g.slug}`}>
                            <Button variant="primary" size="sm" icon={<Gamepad2 className="w-4 h-4" />}>
                              Play Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            ) : (
              <EmptyState
                icon={<Gamepad2 className="w-8 h-8" />}
                title="No games yet"
                description="The arena is being prepared. Check back soon!"
                action={<Link href="/playground"><Button>Try the Coder Station</Button></Link>}
              />
            )}
          </div>
        )}

        {!loading && tab === 'leaderboard' && (
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-heading font-semibold text-white">
                  {leaderboardBoard === 'arena' ? 'Arena high scores' : 'Institute points'}
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  {leaderboardBoard === 'arena'
                    ? 'Highest scores across built-in robotics mini-games.'
                    : pointsPeriod === 'weekly'
                      ? 'Points earned in the last 7 days (lessons, games, and more).'
                      : 'Lifetime points from enrolled learning and Game Lab.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setLeaderboardBoard('arena')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    leaderboardBoard === 'arena'
                      ? 'bg-brand-accent text-brand-dark'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  Mini-games
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardBoard('institute')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    leaderboardBoard === 'institute'
                      ? 'bg-brand-accent text-brand-dark'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> Institute
                </button>
              </div>
              {leaderboardBoard === 'institute' && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setPointsPeriod('all')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium ${
                      pointsPeriod === 'all'
                        ? 'bg-white/15 text-white'
                        : 'bg-white/5 text-white/45 hover:bg-white/10'
                    }`}
                  >
                    All-time
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointsPeriod('weekly')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium ${
                      pointsPeriod === 'weekly'
                        ? 'bg-white/15 text-white'
                        : 'bg-white/5 text-white/45 hover:bg-white/10'
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              )}
            </div>

            {leaderboardBoard === 'arena' &&
              (leaderboard.length === 0 ? (
              <EmptyState
                icon={<Trophy className="w-8 h-8" />}
                title="Leaderboard is empty"
                description="Be the first to put your name on it!"
                action={<Link href="/arena/robot-maze"><Button>Play Robot Maze</Button></Link>}
              />
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((p, i) => {
                  const u = p.user;
                  const first = typeof u?.firstName === 'string' ? u.firstName : '';
                  const last = typeof u?.lastName === 'string' ? u.lastName : '';
                  const scoreNum = typeof p.score === 'number' && !Number.isNaN(p.score) ? p.score : 0;
                  const rankKey = u?.id ? `${u.id}-${i}` : `row-${i}`;
                  return (
                  <div key={rankKey} className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                        i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-300' :
                        i === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-white/5 text-white/40'
                      }`}
                    >
                      {i === 0 ? <Crown className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold text-white">
                      {(first.charAt(0) || '?')}{(last.charAt(0) || '')}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {first || 'Player'} {last ? `${last.charAt(0)}.` : ''}
                      </div>
                      {p.game?.name && (
                        <div className="text-xs text-white/40">{p.game.name}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-heading font-bold text-brand-accent">{scoreNum.toLocaleString()}</div>
                      <div className="text-xs text-white/40">points</div>
                    </div>
                  </div>
                  );
                })}
              </div>
              ))}

            {leaderboardBoard === 'institute' &&
              (instituteLoading ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : instituteRows.length === 0 ? (
                <EmptyState
                  icon={<Sparkles className="w-8 h-8" />}
                  title="No rows yet"
                  description="Lesson completions and published games add institute points."
                  action={
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Link href="/courses"><Button size="sm">Courses</Button></Link>
                      <Link href="/game-lab"><Button size="sm" variant="secondary">Game Lab</Button></Link>
                    </div>
                  }
                />
              ) : (
                <div className="divide-y divide-white/5">
                  {instituteRows.map((p, i) => {
                    const u = p.user;
                    const uid = u?.id ?? `unknown-${i}`;
                    const first = u?.firstName ?? '';
                    const last = u?.lastName ?? '';
                    const pts = typeof p.points === 'number' ? p.points : 0;
                    return (
                    <div
                      key={`${p.rank}-${uid}`}
                      className={`flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors ${
                        p.isMe ? 'bg-brand-accent/10' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                          i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          i === 1 ? 'bg-gray-400/20 text-gray-300' :
                          i === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-white/5 text-white/40'
                        }`}
                      >
                        {p.rank === 1 ? <Crown className="w-4 h-4" /> : p.rank}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold text-white">
                        {(first.charAt(0) || '?')}{(last.charAt(0) || '')}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {first || 'Student'} {last}
                          {p.isMe ? <Badge variant="accent" className="ml-2 text-[10px] py-0">You</Badge> : null}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-heading font-bold text-brand-accent">{pts.toLocaleString()}</div>
                        <div className="text-xs text-white/40">points</div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              ))}
          </GlassCard>
        )}

        {!loading && tab === 'achievements' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3 mb-2">
              <GlassCard className="p-4 text-sm text-white/60 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-accent" />
                Earn achievements by playing games and completing challenges. Your unlocked achievements appear in your portfolio.
              </GlassCard>
            </div>
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard className="p-5 flex items-start gap-4">
                  <div className="text-3xl">{ach.icon}</div>
                  <div>
                    <h4 className="font-heading font-semibold text-white text-sm">{ach.name}</h4>
                    <p className="text-xs text-white/40 mb-2">{ach.desc}</p>
                    <Badge variant="accent">{ach.points} pts</Badge>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <Footer />
    </main>
  );
}
