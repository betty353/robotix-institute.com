'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Briefcase,
  Building2,
  Cpu,
  Gamepad2,
  GraduationCap,
  Newspaper,
  RadioTower,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Sprout,
  Trophy,
  Users,
  Wifi,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminContactInbox from '@/components/admin/AdminContactInbox';
import AdminGameLabQueue from '@/components/admin/AdminGameLabQueue';
import AdminTeamOps from '@/components/admin/AdminTeamOps';
import AdminWeekendLeads from '@/components/admin/AdminWeekendLeads';
import { Badge, Button, GlassCard, Input, ProgressBar, Section } from '@/components/ui';
import { useAuthStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';

type AdminStatsPayload = {
  stats: {
    users: {
      total: number;
      students: number;
      instructors: number;
    };
    courses: {
      total: number;
      enrollments: number;
    };
    marketplace: {
      products: number;
      orders: number;
      revenue: number;
    };
    competitions: {
      total: number;
      active: number;
    };
  };
  recentEnrollments: Array<{
    enrolledAt: string;
    user?: { firstName: string; lastName: string } | null;
    course?: { title: string; slug: string } | null;
  }>;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user?: { firstName: string; lastName: string } | null;
    items?: Array<{ product?: { name: string } | null }>;
  }>;
  popularCourses: Array<{
    title: string;
    slug: string;
    enrollmentCount: number;
  }>;
};

const tabs = ['Command Center', 'Governance', 'Team Ops', 'Programs', 'Commerce', 'Game Lab', 'Settings'] as const;

const controlModules = [
  {
    title: 'User and identity control',
    description: 'Manage students, parents, innovators, staff roles, and access to ecosystem capabilities.',
    icon: Users,
  },
  {
    title: 'School partnership operations',
    description: 'Activate school dashboards, robotics clubs, event registrations, and performance intelligence.',
    icon: Building2,
  },
  {
    title: 'AI and content governance',
    description: 'Moderate Robotix AI usage, newsletters, media publishing, and learning content pipelines.',
    icon: Bot,
  },
  {
    title: 'IoT and agriculture monitoring',
    description: 'Track smart farming dashboards, device health, alerts, and live systems across deployments.',
    icon: Sprout,
  },
];

const operationsFeed = [
  'Newsletter automation segment prepared for learners, schools, and founders.',
  'Community moderation queue synced with discussion, comments, and creator approvals.',
  'Innovation media pipeline ready for event livestreams, founder stories, and student showcases.',
  'Realtime dashboard layer tracking IoT sensors, activity streams, and ecosystem engagement.',
];

const schoolSignals = [
  { name: 'School onboarding readiness', value: 82 },
  { name: 'Community moderation health', value: 74 },
  { name: 'Robotix AI service confidence', value: 91 },
  { name: 'AgriTech sensor visibility', value: 68 },
];

const systemAlerts = [
  { title: 'Innovation media schedule', detail: 'Three ecosystem stories queued for publication today.', tone: 'cyan' },
  { title: 'Partnership pipeline', detail: 'Two schools are ready for dashboard activation and robotics club onboarding.', tone: 'violet' },
  { title: 'Competition operations', detail: 'Challenge submissions are flowing into moderation and review panels.', tone: 'emerald' },
];

const fallbackData: AdminStatsPayload = {
  stats: {
    users: { total: 2840, students: 2230, instructors: 56 },
    courses: { total: 48, enrollments: 3920 },
    marketplace: { products: 126, orders: 184, revenue: 384200 },
    competitions: { total: 12, active: 4 },
  },
  recentEnrollments: [
    {
      enrolledAt: new Date().toISOString(),
      user: { firstName: 'Chelstone', lastName: 'STEM Club' },
      course: { title: 'Robotix Academy Launch Path', slug: 'robotix-academy-launch-path' },
    },
    {
      enrolledAt: new Date(Date.now() - 86_400_000).toISOString(),
      user: { firstName: 'Makeni', lastName: 'Innovation Lab' },
      course: { title: 'AI and Robotics Foundations', slug: 'ai-robotics-foundations' },
    },
    {
      enrolledAt: new Date(Date.now() - 172_800_000).toISOString(),
      user: { firstName: 'Copperbelt', lastName: 'Builder Circle' },
      course: { title: 'IoT Systems for Smart Agriculture', slug: 'iot-systems-smart-agriculture' },
    },
  ],
  recentOrders: [
    {
      id: 'ec-2401',
      total: 5400,
      status: 'processing',
      createdAt: new Date().toISOString(),
      user: { firstName: 'Prototype', lastName: 'Lab' },
      items: [{ product: { name: 'Robotics starter kits' } }],
    },
    {
      id: 'ec-2400',
      total: 2800,
      status: 'shipped',
      createdAt: new Date(Date.now() - 86_400_000).toISOString(),
      user: { firstName: 'AgriTech', lastName: 'Pilot' },
      items: [{ product: { name: 'Soil and climate sensor bundle' } }],
    },
    {
      id: 'ec-2399',
      total: 1900,
      status: 'delivered',
      createdAt: new Date(Date.now() - 172_800_000).toISOString(),
      user: { firstName: 'Drone', lastName: 'Builders' },
      items: [{ product: { name: 'ESP32 and navigation pack' } }],
    },
  ],
  popularCourses: [
    { title: 'AI and Robotics Foundations', slug: 'ai-robotics-foundations', enrollmentCount: 640 },
    { title: 'Smart Agriculture Systems', slug: 'smart-agriculture-systems', enrollmentCount: 472 },
    { title: 'Robotix Builder Lab', slug: 'robotix-builder-lab', enrollmentCount: 389 },
  ],
};

function initials(name?: string | null, surname?: string | null) {
  return `${name?.charAt(0) || 'R'}${surname?.charAt(0) || 'I'}`.toUpperCase();
}

export default function AdminPage() {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Command Center');
  const [payload, setPayload] = useState<AdminStatsPayload>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const loadStats = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json?.message || 'Admin analytics could not be loaded.');
        }
        if (!cancelled && json?.data) {
          setPayload(json.data as AdminStatsPayload);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Admin analytics could not be loaded.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const statCards = useMemo(
    () => [
      {
        label: 'Ecosystem users',
        value: payload.stats.users.total.toLocaleString(),
        detail: `${payload.stats.users.students.toLocaleString()} students active in the network`,
        icon: Users,
      },
      {
        label: 'Learning flow',
        value: payload.stats.courses.enrollments.toLocaleString(),
        detail: `${payload.stats.courses.total} courses and pathways live`,
        icon: GraduationCap,
      },
      {
        label: 'Commerce + hardware',
        value: formatCurrency(payload.stats.marketplace.revenue),
        detail: `${payload.stats.marketplace.orders} marketplace orders processed`,
        icon: ShoppingBag,
      },
      {
        label: 'Competition system',
        value: payload.stats.competitions.active.toString(),
        detail: `${payload.stats.competitions.total} total competitions tracked`,
        icon: Trophy,
      },
    ],
    [payload]
  );

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/10 pt-28">
        <div className="aurora-bg pointer-events-none absolute inset-0 opacity-80" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <Badge variant="accent" className="mb-4">
                <Shield className="mr-1 h-3 w-3" />
                Admin Super Dashboard
              </Badge>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl">
                Command the Robotix ecosystem like a living innovation grid.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                This control surface is built for governance across users, schools, courses, gaming, media, community, partnerships, AI tooling, agriculture systems, and realtime operations.
              </p>
            </div>

            <GlassCard className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-accent">Operations state</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">Ecosystem command layer</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Live
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Realtime metrics', value: loading ? 'Syncing' : 'Online' },
                  { label: 'AI governance', value: 'Active' },
                  { label: 'Community moderation', value: 'Screening' },
                  { label: 'School rollout', value: 'Ready' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/40">{item.label}</div>
                    <div className="mt-3 text-lg font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-brand-accent text-brand-dark shadow-glow-accent'
                      : 'border border-white/10 bg-white/[0.03] text-white/65 hover:border-brand-accent/25 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-64">
                <Input placeholder="Search systems, schools, creators..." icon={<Search className="h-4 w-4" />} />
              </div>
              <button type="button" className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white/60 transition-colors hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <button type="button" className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white/60 transition-colors hover:text-white">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeTab === 'Command Center' && (
        <>
          <Section className="py-8">
            <div className="grid gap-4 lg:grid-cols-4">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <GlassCard className="h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent">
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="primary" className="text-[10px] uppercase tracking-[0.2em]">
                        Live
                      </Badge>
                    </div>
                    <div className="mt-5 text-3xl font-bold">{stat.value}</div>
                    <div className="mt-2 text-sm font-medium text-white/80">{stat.label}</div>
                    <div className="mt-3 text-sm leading-6 text-white/50">{stat.detail}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
            {loadError && (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                Live admin analytics could not be loaded, so the dashboard is showing a curated ecosystem preview instead.
              </div>
            )}
          </Section>

          <Section className="py-4">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-brand-accent">Realtime intelligence</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold">The ecosystem is built to be operated, not merely displayed.</h3>
                  </div>
                  <BarChart3 className="h-6 w-6 text-brand-accent" />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {operationsFeed.map((item, index) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/35">Signal 0{index + 1}</div>
                      <p className="mt-3 text-sm leading-6 text-white/68">{item}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-brand-accent">Control modules</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold">Key governance surfaces</h3>
                  </div>
                  <BrainCircuit className="h-6 w-6 text-brand-accent" />
                </div>
                <div className="mt-6 space-y-3">
                  {controlModules.map((module) => (
                    <div key={module.title} className="rounded-2xl border border-white/8 bg-black/15 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-brand-accent/10 p-2 text-brand-accent">
                          <module.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{module.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-white/58">{module.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </Section>

          <Section className="py-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <GlassCard className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-brand-accent">Recent activations</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold">Learning, marketplace, and ecosystem activity</h3>
                  </div>
                  <Activity className="h-6 w-6 text-brand-accent" />
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Recent enrollments</h4>
                      <Link href="/courses" className="text-sm text-brand-accent hover:text-brand-accent-light">
                        Open academy
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {payload.recentEnrollments.map((item, index) => (
                        <div key={`${item.course?.slug || 'course'}-${index}`} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-xs font-bold">
                              {initials(item.user?.firstName, item.user?.lastName)}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-white">
                                {[item.user?.firstName, item.user?.lastName].filter(Boolean).join(' ') || 'Robotix learner'}
                              </div>
                              <div className="truncate text-xs text-white/45">{item.course?.title || 'Robotix course'}</div>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-white/35">{formatDate(item.enrolledAt)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">Marketplace flow</h4>
                      <Link href="/marketplace" className="text-sm text-brand-accent hover:text-brand-accent-light">
                        Open commerce
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {payload.recentOrders.map((order) => (
                        <div key={order.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-white">#{order.id.slice(-6).toUpperCase()}</div>
                              <div className="text-xs text-white/45">
                                {[order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || 'Robotix order'}
                              </div>
                            </div>
                            <Badge variant={order.status === 'delivered' ? 'primary' : order.status === 'shipped' ? 'accent' : 'success'}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="mt-3 text-sm text-white/68">
                            {order.items?.[0]?.product?.name || 'Marketplace bundle'}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-white/35">
                            <span>{formatCurrency(order.total)}</span>
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-brand-accent">Signals</p>
                      <h3 className="mt-2 font-heading text-xl font-semibold">Health across key layers</h3>
                    </div>
                    <Wifi className="h-5 w-5 text-brand-accent" />
                  </div>
                  <div className="mt-5 space-y-4">
                    {schoolSignals.map((signal) => (
                      <div key={signal.name}>
                        <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                          <span>{signal.name}</span>
                          <span>{signal.value}%</span>
                        </div>
                        <ProgressBar value={signal.value} />
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-brand-accent">Priority alerts</p>
                      <h3 className="mt-2 font-heading text-xl font-semibold">What needs attention</h3>
                    </div>
                    <RadioTower className="h-5 w-5 text-brand-accent" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {systemAlerts.map((alert) => (
                      <div key={alert.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <div className="text-sm font-semibold text-white">{alert.title}</div>
                        <div className="mt-2 text-sm leading-6 text-white/58">{alert.detail}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </Section>
        </>
      )}

      {activeTab === 'Governance' && (
        <Section className="py-8">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'User governance',
                  text: 'Identity, roles, parent visibility, student protection, and creator moderation logic.',
                  icon: Users,
                },
                {
                  title: 'School rollout',
                  text: 'Partnership onboarding, dashboard access, robotics clubs, resources, and communications.',
                  icon: Building2,
                },
                {
                  title: 'Community safety',
                  text: 'Thread approvals, comment moderation, trending discussions, and reporting workflows.',
                  icon: Shield,
                },
                {
                  title: 'Media publishing',
                  text: 'News, newsletters, podcasts, event streaming, and ecosystem storytelling controls.',
                  icon: Newspaper,
                },
              ].map((item) => (
                <GlassCard key={item.title} className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{item.text}</p>
                </GlassCard>
              ))}
            </div>

            <AdminContactInbox />
            <AdminWeekendLeads />
          </div>
        </Section>
      )}

      {activeTab === 'Programs' && (
        <Section className="py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Robotix Academy', metric: `${payload.stats.courses.total} active learning modules`, icon: GraduationCap },
              { title: 'AI Builder Platform', metric: 'Templates for apps, chatbots, and automations', icon: Bot },
              { title: 'Game and simulation layer', metric: 'Interactive labs and challenge environments', icon: Gamepad2 },
              { title: 'AgriTech systems', metric: 'Smart farming dashboards and connected field intelligence', icon: Sprout },
              { title: 'Innovation hub', metric: 'Founder pathways, ventures, and prototype readiness', icon: Briefcase },
              { title: 'Research and hardware', metric: `${payload.stats.marketplace.products} product and kit surfaces`, icon: Cpu },
            ].map((item) => (
              <GlassCard key={item.title} hover className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <Sparkles className="h-5 w-5 text-white/25" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{item.metric}</p>
              </GlassCard>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'Team Ops' && (
        <Section className="py-8">
          <AdminTeamOps />
        </Section>
      )}

      {activeTab === 'Commerce' && (
        <Section className="py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-2xl font-semibold">Marketplace intelligence</h3>
                <ShoppingBag className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/40">Revenue</div>
                  <div className="mt-3 text-3xl font-bold">{formatCurrency(payload.stats.marketplace.revenue)}</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/40">Orders</div>
                  <div className="mt-3 text-3xl font-bold">{payload.stats.marketplace.orders}</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-2xl font-semibold">Popular learning demand</h3>
                <GraduationCap className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="mt-6 space-y-3">
                {payload.popularCourses.map((course) => (
                  <div key={course.slug} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-sm font-semibold text-white">{course.title}</div>
                    <div className="mt-2 text-sm text-white/55">{course.enrollmentCount} enrollments</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Section>
      )}

      {activeTab === 'Game Lab' && (
        <Section className="py-8">
          <div className="mb-6 max-w-3xl">
            <Badge variant="accent" className="mb-4">
              <Gamepad2 className="mr-1 h-3 w-3" />
              STEM Game Zone Moderation
            </Badge>
            <h2 className="section-title">Review what young builders are creating before it goes live.</h2>
            <p className="section-subtitle mt-4">
              This queue acts as the quality and safety gate for game-based learning projects, challenge content, and playable innovation experiments.
            </p>
          </div>
          <AdminGameLabQueue />
        </Section>
      )}

      {activeTab === 'Settings' && (
        <Section className="py-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="p-6">
              <h3 className="font-heading text-2xl font-semibold">Ecosystem settings</h3>
              <div className="mt-6 space-y-4">
                <Input defaultValue="Robotix Institute Zambia" />
                <Input defaultValue="ecosystem@robotix.zm" />
                <Input defaultValue="+260 97X XXX XXX" />
                <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                  Save ecosystem configuration
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-heading text-2xl font-semibold">Automation switches</h3>
              <div className="mt-6 space-y-3">
                {[
                  'Realtime dashboard alerts',
                  'Newsletter automation',
                  'Community moderation escalation',
                  'School onboarding notifications',
                  'AI tool governance logging',
                ].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-white/68">{item}</span>
                    <div className={`h-6 w-11 rounded-full p-1 ${index !== 3 ? 'bg-brand-accent' : 'bg-white/10'}`}>
                      <div className={`h-4 w-4 rounded-full bg-white ${index !== 3 ? 'translate-x-5' : 'translate-x-0'} transition-transform`} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Section>
      )}

      <Footer />
    </main>
  );
}
