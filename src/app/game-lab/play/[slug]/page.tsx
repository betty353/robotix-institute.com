'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GameLabPreview } from '@/components/game-lab/GameLabPreview';
import { Button, LoadingSpinner, GlassCard } from '@/components/ui';
import { useAuth } from '@/hooks/useApi';
import { ArrowLeft } from 'lucide-react';

export default function GamePlayPage() {
  const { slug } = useParams<{ slug: string }>();
  const { token } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const url = `/api/game-projects/${slug}?play=1`;
      const res = await fetch(url, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json();
      if (!res.ok) {
        throw new Error(j.error || j.message || 'Unavailable');
      }
      setTitle((j.data as { title?: string }).title ?? slug);
      setCode((j.data as { code: string }).code);
      setErr(null);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error');
      setCode(null);
    }
  }, [slug, token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="bg-brand-dark min-h-screen pt-14">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <Link href="/game-gallery"><Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>Gallery</Button></Link>
        <Link href={`/game-lab/${slug}`}><Button variant="ghost" size="sm">Edit in Lab</Button></Link>
      </div>
      {err ? (
        <GlassCard className="max-w-lg mx-auto p-8 text-center text-red-300">{err}</GlassCard>
      ) : code == null ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="text-center font-heading font-bold text-white text-xl pb-4">{title}</h1>
          <div className="max-w-4xl mx-auto px-2 pb-12">
            <GameLabPreview code={code} title={title} />
          </div>
        </>
      )}
      <Footer />
    </main>
  );
}
