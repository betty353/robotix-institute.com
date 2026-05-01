'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GlassCard, Badge, Button, Input, LoadingSpinner } from '@/components/ui';
import { GameLabPreview } from '@/components/game-lab/GameLabPreview';
import { useApi, useAuth } from '@/hooks/useApi';
import { Save, Send, Undo2, Play, ArrowLeft } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface GameDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  code: string;
  status: string;
  rejectionReason?: string | null;
}

export default function GameLabEditorPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { token, isAuthenticated } = useAuth();
  const { patch, post, del } = useApi();

  const [game, setGame] = useState<GameDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/game-projects/${slug}`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Failed');
      const dto = json.data as GameDto;
      setGame(dto);
      setTitle(dto.title);
      setDescription(dto.description ?? '');
      setCode(dto.code);
    } catch {
      toast.error('Could not load game');
      setGame(null);
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!game) return;
    setSaving(true);
    try {
      await patch(`/game-projects/${slug}`, { title, description, code }, { requireAuth: true });
      toast.success('Saved');
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await post(`/game-projects/${slug}/publish`, {}, { requireAuth: true });
      toast.success('Sent to admin queue');
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Submit failed');
    }
  };

  const handleUnpublish = async () => {
    try {
      await del(`/game-projects/${slug}/publish`, { requireAuth: true });
      toast.success('Returned to draft');
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Unpublish failed');
    }
  };

  const runPreview = () => setPreviewKey((k) => k + 1);

  const badgeVariant = useMemo(() => {
    const s = game?.status ?? '';
    if (s === 'PUBLISHED') return 'success' as const;
    if (s === 'REJECTED') return 'danger' as const;
    if (s === 'PENDING') return 'accent' as const;
    return 'primary' as const;
  }, [game]);

  if (!isAuthenticated) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <Navbar />
        <GlassCard className="max-w-md mx-auto mt-32 p-8 text-center">
          <p className="text-white/70 mb-4">Sign in required</p>
          <Link href={`/login?next=/game-lab/${slug}`}><Button>Sign in</Button></Link>
        </GlassCard>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-brand-dark min-h-screen flex flex-col min-h-[100vh]">
      <Navbar />
      <div className="pt-[4.25rem] border-b border-white/10 shrink-0 lg:sticky lg:top-0 lg:z-40 bg-brand-dark">
        <div className="max-w-[1800px] mx-auto px-3 py-2 flex flex-wrap items-center gap-2">
          <Link href="/game-lab" className="text-white/50 hover:text-white text-sm inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Studio
          </Link>
          {game && <Badge variant={badgeVariant}>{game.status}</Badge>}
          <span className="text-white/30 text-xs">/{slug}</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => window.open(`/game-lab/play/${slug}`, '_blank')}>
              Open player tab
            </Button>
            <Button size="sm" variant="secondary" icon={<Undo2 className="w-4 h-4" />} onClick={runPreview}>
              Reload preview
            </Button>
            <Button size="sm" variant="ghost" icon={<Play className="w-4 h-4 text-green-400" />} onClick={runPreview}>
              Run
            </Button>
            <Button size="sm" loading={saving} icon={<Save className="w-4 h-4" />} onClick={handleSave}>
              Save
            </Button>
            {game?.status !== 'PUBLISHED' && game?.status !== 'PENDING' && (
              <Button size="sm" variant="primary" icon={<Send className="w-4 h-4" />} onClick={handleSubmitReview}>
                Submit review
              </Button>
            )}
            {game?.status === 'PUBLISHED' && (
              <Button size="sm" variant="danger" onClick={handleUnpublish}>Unpublish</Button>
            )}
          </div>
        </div>
      </div>

      {loading || !game ? (
        <div className="flex-1 flex items-center justify-center py-24"><LoadingSpinner /></div>
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row min-h-0">
          <div className="flex-1 min-w-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="p-3 space-y-2 shrink-0">
              <Input label="Game title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea
                className="input-field min-h-[60px] text-sm resize-y bg-white/[0.04]"
                placeholder="Short description…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {game.rejectionReason ? (
                <p className="text-xs text-red-400">{game.rejectionReason}</p>
              ) : null}
            </div>
            <div className="flex-1 min-h-[340px]">
              <MonacoEditor
                height="min(70vh, 640px)"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
          <aside className="w-full lg:w-[min(760px,50vw)] shrink-0 p-3 bg-brand-dark-surface">
            <h2 className="text-xs uppercase tracking-wide text-white/40 mb-2">Live preview · Phaser 3</h2>
            <GameLabPreview key={previewKey} code={code} title={`Preview ${previewKey}`} />
          </aside>
        </div>
      )}
      <Footer />
    </main>
  );
}
