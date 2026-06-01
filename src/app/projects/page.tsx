'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge, Button, GlassCard, Input, LoadingSpinner, Section } from '@/components/ui';
import { creatorPipelines } from '@/lib/ecosystem-data';
import { schoolProjects } from '@/lib/school-projects';
import {
  ArrowRight,
  BookOpen,
  CircuitBoard,
  Code,
  Cpu,
  Eye,
  Heart,
  Search,
  School,
  Video,
  Wrench,
} from 'lucide-react';

interface ProjectCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  components: string[];
  likes: number;
  views: number;
  circuitUrl?: string | null;
  sourceCode?: string | null;
  tutorialMd?: string | null;
  videoUrl?: string | null;
  thumbnail?: string | null;
  user?: { id: string; firstName: string; lastName: string; avatar?: string | null };
}

const fallbackProjects: ProjectCard[] = [
  {
    id: '1',
    slug: 'line-follower-robot',
    title: 'Line Follower Robot',
    description: 'Build a robot that follows a guided path using IR sensing, control logic, and practical classroom hardware.',
    category: 'Robotics',
    difficulty: 'beginner',
    components: ['Arduino Uno', 'IR sensors', 'Motor driver', 'DC motors', 'Chassis kit', 'Battery'],
    likes: 342,
    views: 2890,
    circuitUrl: 'https://example.com/circuit',
    sourceCode: 'available',
    tutorialMd: 'available',
    videoUrl: 'https://example.com/video',
  },
  {
    id: '2',
    slug: 'smart-irrigation-system',
    title: 'Smart Irrigation System',
    description: 'An agriculture automation build combining soil monitoring, irrigation logic, and connected dashboard thinking.',
    category: 'Agriculture IoT',
    difficulty: 'intermediate',
    components: ['ESP32', 'Soil moisture sensor', 'Water pump', 'Relay', 'DHT22', 'Solar panel'],
    likes: 528,
    views: 4120,
    circuitUrl: 'https://example.com/circuit',
    sourceCode: 'available',
    tutorialMd: 'available',
    videoUrl: 'https://example.com/video',
  },
  {
    id: '3',
    slug: 'ai-object-detection-robot',
    title: 'AI Object Detection Robot',
    description: 'A mobile robot that uses computer vision thinking, embedded hardware, and edge intelligence for object detection.',
    category: 'AI & Vision',
    difficulty: 'advanced',
    components: ['ESP32-CAM', 'Motor driver', 'DC motors', 'Chassis', 'Battery', 'LED indicators'],
    likes: 389,
    views: 3100,
    circuitUrl: 'https://example.com/circuit',
    sourceCode: 'available',
    tutorialMd: 'available',
    videoUrl: 'https://example.com/video',
  },
];

const categoryTone: Record<string, string> = {
  Robotics: 'from-brand-secondary to-brand-primary',
  'Agriculture IoT': 'from-emerald-400 to-brand-secondary',
  Automation: 'from-orange-400 to-brand-accent',
  'AI & Vision': 'from-brand-accent to-fuchsia-500',
  IoT: 'from-cyan-400 to-brand-secondary',
  Drones: 'from-slate-300 to-brand-primary',
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState<ProjectCard[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        if (search.trim()) params.set('search', search.trim());
        params.set('limit', '24');

        const res = await fetch(`/api/projects?${params.toString()}`).then((r) => r.json()).catch(() => null);
        if (cancelled) return;
        const liveProjects = Array.isArray(res?.data) ? res.data : [];
        if (liveProjects.length > 0) setProjects(liveProjects);
        else if (!search.trim() && selectedCategory === 'All') setProjects(fallbackProjects);
        else setProjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    const id = setTimeout(load, search.trim() ? 250 : 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [search, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set(['All', ...fallbackProjects.map((project) => project.category), ...projects.map((project) => project.category)]);
    return Array.from(set);
  }, [projects]);

  const featuredCount = projects.filter((project) => project.likes >= 300).length;

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="aurora-bg absolute inset-0 opacity-80" />
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <Badge variant="accent" className="mb-4">
                <BookOpen className="mr-1 h-3 w-3" />
                School Project Archive
              </Badge>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">
                Public school projects that show what Robotix learners actually built and learned.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                This page now highlights the school projects Robotix has publicly named across its own coverage, from
                French International School to Northmead and the LICS Smart House Challenge.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/build">
                  <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>Create a prototype</Button>
                </Link>
                <Link href="/simulation">
                  <Button variant="secondary" size="lg" icon={<Cpu className="h-5 w-5" />}>Open robotics lab</Button>
                </Link>
              </div>
            </div>

            <GlassCard className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Published builds', value: projects.length.toString() },
                  { label: 'Featured systems', value: featuredCount.toString() },
                  { label: 'Category coverage', value: `${categories.length - 1}` },
                  { label: 'Publishing modes', value: creatorPipelines.length.toString() },
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

      <Section className="py-8">
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            { title: 'School case studies', text: 'Projects Robotix has publicly tied to named schools and student cohorts.', icon: School },
            { title: 'Robotics + coding', text: 'Tessa builds, block coding, Scratch, smart-home logic, and sensors.', icon: Cpu },
            { title: 'Learning outcomes', text: 'Problem-solving, creativity, teamwork, circuits, sensors, and first-tech exposure.', icon: Code },
            { title: 'Evidence-backed archive', text: 'Each featured school project is linked back to the public Robotix source material.', icon: CircuitBoard },
          ].map((item) => (
            <GlassCard key={item.title} className="p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              <School className="mr-1 h-3 w-3" />
              Named School Projects
            </Badge>
            <h2 className="font-heading text-3xl font-bold">Projects Robotix has publicly named with schools</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              These cards focus on the school projects Robotix has actually described in its public articles, plus the
              specific things students were reported to learn from each one.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {schoolProjects.map((project) => (
            <GlassCard key={project.slug} className="overflow-hidden p-0 shine-effect school-lift">
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.imageSrc} alt={project.imageAlt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <Badge variant="accent">{project.category}</Badge>
                  <Badge variant="primary">{project.periodLabel}</Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">{project.schoolName}</div>
                <h3 className="mt-3 font-heading text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{project.description}</p>

                <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-brand-secondary">What students learned</div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-white/64">
                    {project.learningOutcomes.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.components.slice(0, 3).map((component) => (
                    <span key={component} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/58">
                      {component}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <Link href={`/projects/${project.slug}`}>
                    <Button icon={<ArrowRight className="h-4 w-4" />}>Open school project</Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="py-4">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-xl">
            <Input
              placeholder="Search projects, systems, or categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-brand-secondary text-white'
                    : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingSpinner size="lg" /> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const gradient = categoryTone[project.category] || 'from-brand-primary to-brand-accent';
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <GlassCard hover className="flex h-full flex-col p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}>
                        <Wrench className="h-7 w-7 text-white" />
                      </div>
                      <Badge variant={project.difficulty === 'beginner' ? 'success' : project.difficulty === 'intermediate' ? 'accent' : 'danger'}>
                        {project.difficulty}
                      </Badge>
                    </div>

                    <Badge variant="primary" className="w-fit">{project.category}</Badge>
                    <h2 className="mt-4 font-heading text-2xl font-bold">{project.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-white/58">{project.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.components.slice(0, 3).map((component) => (
                        <span key={component} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/58">
                          {component}
                        </span>
                      ))}
                      {project.components.length > 3 ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/42">
                          +{project.components.length - 3} more
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/42">
                      {project.tutorialMd ? <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> Tutorial</span> : null}
                      {project.sourceCode ? <span className="inline-flex items-center gap-1"><Code className="h-3 w-3" /> Code</span> : null}
                      {project.videoUrl ? <span className="inline-flex items-center gap-1"><Video className="h-3 w-3" /> Video</span> : null}
                      {project.circuitUrl ? <span className="inline-flex items-center gap-1"><CircuitBoard className="h-3 w-3" /> Circuit</span> : null}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex items-center gap-4 text-xs text-white/42">
                        <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {project.likes}</span>
                        <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {project.views}</span>
                      </div>
                      <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent">
                        Open build <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </Section>

      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-accent" />
              <h2 className="font-heading text-2xl font-bold">What a publishable project includes</h2>
            </div>
            <div className="space-y-3">
              {[
                'Clear problem framing and real African context relevance.',
                'Component lists and wiring logic that other builders can reproduce.',
                'Visible code, tutorials, and test outcomes for credibility.',
                'A route into community discussion, portfolios, and future showcases.',
              ].map((line) => (
                <div key={line} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                  {line}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-brand-accent" />
              <h2 className="font-heading text-2xl font-bold">Creator pipeline</h2>
            </div>
            <div className="space-y-3">
              {creatorPipelines.map((pipeline) => (
                <Link
                  key={pipeline.title}
                  href={pipeline.destination}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <p className="font-semibold text-white">{pipeline.title}</p>
                  <p className="mt-2">{pipeline.detail}</p>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
