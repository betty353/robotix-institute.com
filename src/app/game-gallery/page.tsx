'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, Input, LoadingSpinner, EmptyState } from '@/components/ui';
import { Gamepad2, Play, ArrowLeft, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useApi';

interface Card {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string;
  playCount: number;
  likeCount?: number;
  liked?: boolean;
  user?: { id: string; firstName: string; lastName: string };
}

function GalleryInner() {
  const params = useSearchParams();
  const focus = params.get('view');
  const { token, isAuthenticated } = useAuth();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [items, setItems] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = `/api/game-projects?sort=${sort}&limit=24&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const j = await res.json();
        setItems(Array.isArray(j.data) ? j.data : []);
      } catch {
        toast.error('Gallery load failed');
      } finally {
        setLoading(false);
      }
    };
    const id = setTimeout(load, q.length > 0 ? 300 : 0);
    return () => clearTimeout(id);
  }, [sort, q, token]);

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />
      <section className="pt-28 pb-6 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-2"><Gamepad2 className="w-3 h-3 mr-1" /> Creator Gallery</Badge>
            <h1 className="font-heading text-3xl font-bold text-white">Published student games</h1>
            <p className="text-white/50 text-sm mt-1">Phaser.js creations approved by admins.</p>
          </div>
          <Link href="/game-lab">
            <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4 rotate-180" />} className="-rotate-0">
              Open Game Lab Studio
            </Button>
          </Link>
        </div>
      </section>

      <Section>
        <div className="flex flex-wrap gap-3 mb-6">
          <Input placeholder="Search title…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          {(['recent', 'popular', 'trending'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize ${
                sort === s ? 'bg-brand-accent text-brand-dark font-semibold' : 'bg-white/5 text-white/50'
              }`}
            >
              {s === 'popular' ? 'likes' : s === 'trending' ? 'plays' : s}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState
            icon={<Gamepad2 className="w-8 h-8" />}
            title="No games published yet"
            description="Become the first published creator!"
            action={isAuthenticated ? <Link href="/game-lab"><Button>Studio</Button></Link> : <Link href="/register"><Button>Join</Button></Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((g) => (
              <GlassCard
                key={g.id}
                className={`p-5 flex flex-col gap-3 ${focus === g.slug ? 'ring-2 ring-brand-accent' : ''}`}
              >
                <div>
                  <h3 className="font-heading font-semibold text-white line-clamp-1">{g.title}</h3>
                  <p className="text-xs text-white/40">
                    By {g.user?.firstName} {g.user?.lastName?.charAt(0)}.
                  </p>
                </div>
                <p className="text-sm text-white/50 line-clamp-2">{g.description || '—'}</p>
                <div className="flex items-center gap-3 text-[11px] text-white/40">
                  <span>▶ {g.playCount}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> {g.likeCount ?? '—'}</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Link href={`/game-lab/play/${g.slug}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full" icon={<Play className="w-4 h-4" />}>Play</Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </Section>
      <Footer />
    </main>
  );
}

export default function GameGalleryPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GalleryInner />
    </Suspense>
  );
}
