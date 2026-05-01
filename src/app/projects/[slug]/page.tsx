'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, LoadingSpinner, EmptyState } from '@/components/ui';
import {
  ArrowLeft, Heart, Eye, Github, Video, Cpu, Wrench,
  Calendar, Code2, BookOpen, Share2
} from 'lucide-react';

interface RobotProjectDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  components: string[] | string;
  circuitUrl?: string;
  sourceCode?: string;
  tutorialMd?: string;
  videoUrl?: string;
  thumbnail?: string;
  category: string;
  difficulty: string;
  likes: number;
  views: number;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
}

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<RobotProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/${params.slug}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setProject(data.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug]);

  const handleLike = async () => {
    if (!project) return;
    setLiking(true);
    try {
      const res = await fetch(`/api/projects/${project.slug}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.data?.likes != null) {
        setProject({ ...project, likes: data.data.likes });
        toast.success('Liked!');
      } else if (res.status === 401) {
        toast.error('Please sign in to like projects');
      }
    } catch {
      toast.error('Could not like project');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: project?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied');
      }
    } catch {
      // user cancelled
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

  if (!project) {
    return (
      <main className="bg-brand-dark min-h-screen">
        <Navbar />
        <Section className="pt-28">
          <EmptyState
            icon={<Cpu className="w-8 h-8" />}
            title="Project not found"
            description="This project may have been removed or never existed."
            action={<Link href="/projects"><Button>Browse Projects</Button></Link>}
          />
        </Section>
        <Footer />
      </main>
    );
  }

  const components: string[] = Array.isArray(project.components)
    ? project.components
    : (() => {
        try { return JSON.parse(project.components as string); } catch { return []; }
      })();

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="pt-28 pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> All Projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="primary">{project.category}</Badge>
              <Badge
                variant={
                  project.difficulty === 'beginner' ? 'success' :
                  project.difficulty === 'advanced' ? 'danger' : 'accent'
                }
              >
                {project.difficulty}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-6">
              {project.user && (
                <span className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold">
                    {project.user.firstName.charAt(0)}{project.user.lastName.charAt(0)}
                  </div>
                  {project.user.firstName} {project.user.lastName}
                </span>
              )}
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {project.views}</span>
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {project.likes}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2 mb-8">
              <Button onClick={handleLike} loading={liking} icon={<Heart className="w-4 h-4" />}>
                Like
              </Button>
              <Button variant="secondary" onClick={handleShare} icon={<Share2 className="w-4 h-4" />}>
                Share
              </Button>
              {project.sourceCode && (
                <a href={project.sourceCode} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" icon={<Github className="w-4 h-4" />}>Source</Button>
                </a>
              )}
              {project.videoUrl && (
                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" icon={<Video className="w-4 h-4" />}>Video</Button>
                </a>
              )}
            </div>
          </motion.div>

          {project.thumbnail && (
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.thumbnail} alt={project.title} className="w-full" />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h2 className="font-heading font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-accent" /> About this project
                </h2>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{project.description}</p>
              </GlassCard>

              {project.tutorialMd && (
                <GlassCard className="p-6">
                  <h2 className="font-heading font-semibold text-white mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brand-accent" /> Tutorial
                  </h2>
                  <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-white/70">
                    {project.tutorialMd}
                  </div>
                </GlassCard>
              )}
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <h2 className="font-heading font-semibold text-white mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand-accent" /> Components
                </h2>
                <ul className="space-y-2">
                  {components.length === 0 && (
                    <li className="text-sm text-white/40">No components listed</li>
                  )}
                  {components.map((c) => (
                    <li key={c} className="text-sm text-white/70 flex items-center gap-2">
                      <Cpu className="w-3 h-3 text-brand-accent" /> {c}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {project.circuitUrl && (
                <GlassCard className="p-6">
                  <h2 className="font-heading font-semibold text-white mb-3">Circuit</h2>
                  <a href={project.circuitUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full">View Diagram</Button>
                  </a>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
