'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, LoadingSpinner, EmptyState } from '@/components/ui';
import { useApi, useAuth } from '@/hooks/useApi';
import { ArrowLeft, Gamepad2, Trophy, Crown, Construction } from 'lucide-react';

const RobotMaze = dynamic(() => import('@/components/games/RobotMaze'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  difficulty: string;
  maxScore: number;
  topScores?: Array<{
    id: string;
    score: number;
    level: number;
    user: { firstName: string; lastName: string; avatar?: string };
  }>;
  totalPlayers?: number;
}

export default function GamePlayerPage() {
  const params = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const { post } = useApi();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/games/${params.slug}?leaderboard=true`);
        const data = await res.json();
        if (res.ok && data.data) setGame(data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug]);

  const handleScore = async ({ score, level, time }: { score: number; level: number; time: number }) => {
    if (!isAuthenticated) {
      toast('Sign in to save your score!', { icon: '🔒' });
      return;
    }
    if (!game) return;
    setSubmitting(true);
    try {
      const res = await post(`/games/${game.slug}`, { score, level, time });
      if (res.success) {
        const rank = (res.data as any)?.rank;
        toast.success(rank ? `Score saved! You're rank #${rank}` : 'Score saved!');
        // Refresh leaderboard
        const refresh = await fetch(`/api/games/${params.slug}?leaderboard=true`);
        const data = await refresh.json();
        if (data.data) setGame(data.data);
      }
    } catch (e: any) {
      toast.error(e?.message || 'Could not save score');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <Navbar />
        <div className="pt-32"><LoadingSpinner size="lg" /></div>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <Navbar />
        <Section className="pt-28">
          <EmptyState
            icon={<Gamepad2 className="w-8 h-8" />}
            title="Game not found"
            description="This game might still be in development. Check back soon!"
            action={<Link href="/arena"><Button>Back to Arena</Button></Link>}
          />
        </Section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="pt-28 pb-6 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/arena" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Arena
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge variant="accent" className="mb-2">
                <Gamepad2 className="w-3 h-3 mr-1" /> {game.type.replace('_', ' ')}
              </Badge>
              <h1 className="font-heading text-3xl font-bold text-white">{game.name}</h1>
              <p className="text-sm text-white/50 mt-1 max-w-2xl">{game.description}</p>
            </div>
            <div className="text-right text-xs text-white/40">
              <p>Difficulty: <span className="text-white capitalize">{game.difficulty}</span></p>
              <p>Max Score: <span className="text-brand-accent">{game.maxScore}</span></p>
              {game.totalPlayers != null && <p>Players: <span className="text-white">{game.totalPlayers}</span></p>}
            </div>
          </div>
        </div>
      </section>

      <Section className="py-8 grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassCard className="p-4 lg:p-6">
            {game.type === 'maze' ? (
              <RobotMaze onScore={handleScore} />
            ) : (
              <EmptyState
                icon={<Construction className="w-8 h-8" />}
                title="Coming soon"
                description={`The ${game.name} engine is in active development. Try Robot Maze in the meantime!`}
                action={<Link href="/arena/robot-maze"><Button>Play Robot Maze</Button></Link>}
              />
            )}
            {submitting && (
              <p className="text-xs text-center text-white/40 mt-3">Saving your score…</p>
            )}
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <h2 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-brand-accent" /> Top 10
            </h2>
            {(!game.topScores || game.topScores.length === 0) ? (
              <p className="text-sm text-white/40 text-center py-6">
                No scores yet. Be the first! 🚀
              </p>
            ) : (
              <ol className="space-y-2">
                {game.topScores.map((s, i) => (
                  <li
                    key={s.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-brand-accent/10' : ''}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        i === 1 ? 'bg-gray-400/20 text-gray-300' :
                        i === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-white/5 text-white/40'
                      }`}
                    >
                      {i === 0 ? <Crown className="w-3 h-3" /> : i + 1}
                    </span>
                    <span className="flex-1 text-sm text-white truncate">
                      {s.user.firstName} {s.user.lastName.charAt(0)}.
                    </span>
                    <span className="text-sm font-mono text-brand-accent">{s.score}</span>
                  </li>
                ))}
              </ol>
            )}
          </GlassCard>
        </motion.div>
      </Section>

      <Footer />
    </main>
  );
}
