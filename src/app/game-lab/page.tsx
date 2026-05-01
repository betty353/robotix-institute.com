'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, EmptyState, LoadingSpinner } from '@/components/ui';
import { useApi, useAuth } from '@/hooks/useApi';
import { GAME_LAB_STARTER_CODE } from '@/constants/game-lab-template';
import {
  Gamepad2, Plus, ExternalLink, Layers, Send, Trash2, ShieldCheck,
} from 'lucide-react';

interface GP {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  updatedAt: string;
  playCount: number;
}

const statusColor: Record<string, 'accent' | 'success' | 'danger' | 'primary'> = {
  DRAFT: 'primary',
  PENDING: 'accent',
  PUBLISHED: 'success',
  REJECTED: 'danger',
};

export default function GameLabDashboardPage() {
  const { isAuthenticated } = useAuth();
  const { get, post, del } = useApi();
  const [items, setItems] = useState<GP[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await get<GP[]>('/game-projects?mine=1&limit=50', { requireAuth: true });
      const raw = (res as { data?: GP[]; items?: GP[] }).data ?? (res as { items?: GP[] }).items ?? [];
      setItems(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error('Could not load your games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleNew = async () => {
    setCreating(true);
    try {
      const title = `My Game ${new Date().toLocaleDateString()}`;
      const res = await post<{ slug: string }>('/game-projects', {
        title,
        description: '',
        code: GAME_LAB_STARTER_CODE,
        tags: '',
      }, { requireAuth: true });
      if ((res as { success?: boolean }).success !== false && (res.data as { slug?: string })?.slug) {
        toast.success('New game created');
        window.location.href = `/game-lab/${(res.data as { slug: string }).slug}`;
      }
    } catch {
      toast.error('Create failed — are you logged in?');
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <Navbar />
        <Section className="pt-32">
          <EmptyState
            icon={<Gamepad2 className="w-10 h-10" />}
            title="Game Lab"
            description="Build Phaser.js games with Monaco Editor, publish to the gallery, and earn creator points."
            action={<Link href="/login?next=/game-lab"><Button>Sign in to Studio</Button></Link>}
          />
        </Section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />
      <section className="pt-28 pb-8 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-2"><Gamepad2 className="w-3 h-3 mr-1" /> Game Lab Studio</Badge>
            <h1 className="font-heading text-3xl font-bold text-white">Your game projects</h1>
            <p className="text-white/50 text-sm mt-1">Phaser.js + Monaco. Submit drafts for admin review — live when published.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/game-gallery"><Button variant="secondary" icon={<ExternalLink className="w-4 h-4" />}>Public Gallery</Button></Link>
            <Link href="/dashboard"><Button variant="ghost" icon={<Layers className="w-4 h-4" />}>Dashboard</Button></Link>
            <Button onClick={handleNew} loading={creating} icon={<Plus className="w-4 h-4" />}>New game</Button>
          </div>
        </div>
      </section>

      <Section>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState
            icon={<Gamepad2 className="w-8 h-8" />}
            title="No games yet"
            description='Click "New game" to fork the Robotix starter template.'
            action={<Button onClick={handleNew} loading={creating} icon={<Plus className="w-4 h-4" />}>Create first game</Button>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((g) => (
              <GlassCard key={g.id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-semibold text-white">{g.title}</h3>
                    <p className="text-xs text-white/40 truncate max-w-[240px]">/{g.slug}</p>
                  </div>
                  <Badge variant={statusColor[g.status]}>{g.status}</Badge>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">{g.description || '—'}</p>
                <div className="text-[11px] text-white/35">Plays recorded: {g.playCount}</div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <Link href={`/game-lab/${g.slug}`}><Button size="sm">Edit & run</Button></Link>
                  {g.status === 'PUBLISHED' && (
                    <Link href={`/game-gallery?view=${g.slug}`} target="_blank">
                      <Button size="sm" variant="secondary">Gallery</Button>
                    </Link>
                  )}
                  {g.status !== 'PUBLISHED' && g.status !== 'PENDING' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Trash2 className="w-3 h-3" />}
                      onClick={async () => {
                        if (!confirm('Permanently delete this game project?')) return;
                        try {
                          await del(`/game-projects/${g.slug}`, { requireAuth: true });
                          toast.success('Deleted');
                          load();
                        } catch {
                          toast.error('Delete failed');
                        }
                      }}
                    >Delete</Button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </Section>

      <Section className="pb-24">
        <GlassCard className="p-6 flex gap-4 items-start">
          <ShieldCheck className="w-6 h-6 text-brand-accent shrink-0" />
          <div>
            <h3 className="font-heading font-semibold text-white mb-1">Publishing workflow</h3>
            <p className="text-sm text-white/60">
              Save your draft, hit <Send className="inline w-3 h-3" /> Submit for review. An administrator approves
              games before they appear in the public gallery. Creators earn <strong className="text-brand-accent">+50 points</strong> when published.
            </p>
          </div>
        </GlassCard>
      </Section>
      <Footer />
    </main>
  );
}
