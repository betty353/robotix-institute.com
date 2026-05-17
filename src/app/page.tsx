'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  GraduationCap, Code, Cpu, Gamepad2, Trophy, Users,
  Bot, ArrowRight, Zap, Globe, Award, BookOpen, Wifi, Rocket,
  Star, ChevronRight, Play, CircuitBoard
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Section, SectionHeader, GlassCard, Badge, Button,
  StatCard, ProgressBar
} from '@/components/ui';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TiltCard } from '@/components/ui/TiltCard';
import { HeroSceneErrorBoundary } from '@/components/three/HeroSceneErrorBoundary';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-brand-dark" />,
});

// ─── Animation variants ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Data ───────────────────────────────────────────────────
const stats = [
  { value: 2500, suffix: '+', label: 'Active Students', icon: <Users className="w-6 h-6" /> },
  { value: 120, suffix: '+', label: 'Robot Projects', icon: <Cpu className="w-6 h-6" /> },
  { value: 45, suffix: '+', label: 'Expert Courses', icon: <GraduationCap className="w-6 h-6" /> },
  { value: 15, suffix: '+', label: 'Competitions Won', icon: <Trophy className="w-6 h-6" /> },
];

const featuredCourses = [
  {
    title: 'Robotics Fundamentals',
    description: 'Master the core foundations of robotics — from mechanics to electronics and programming.',
    level: 'Beginner',
    duration: '24 hours',
    icon: <Cpu className="w-8 h-8" />,
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    title: 'Arduino Robotics',
    description: 'Build intelligent robots using Arduino microcontrollers with hands-on projects.',
    level: 'Intermediate',
    duration: '32 hours',
    icon: <CircuitBoard className="w-8 h-8" />,
    color: 'from-green-500/20 to-teal-500/20',
  },
  {
    title: 'ESP32 IoT Systems',
    description: 'Connect robots to the internet and build smart IoT solutions with ESP32.',
    level: 'Intermediate',
    duration: '28 hours',
    icon: <Wifi className="w-8 h-8" />,
    color: 'from-orange-500/20 to-yellow-500/20',
  },
  {
    title: 'AI Robotics',
    description: 'Integrate machine learning and computer vision into robotic systems.',
    level: 'Advanced',
    duration: '40 hours',
    icon: <Bot className="w-8 h-8" />,
    color: 'from-pink-500/20 to-rose-500/20',
  },
  {
    title: 'Drone Programming',
    description: 'Program autonomous drones for navigation, mapping, and aerial missions.',
    level: 'Advanced',
    duration: '36 hours',
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    title: 'Smart Agriculture',
    description: 'Automate farming with robotics, sensors, and data-driven irrigation systems.',
    level: 'Intermediate',
    duration: '30 hours',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-emerald-500/20 to-green-500/20',
  },
];

const platformFeatures = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Coder Play Station',
    description: 'Write and run code in Python, JavaScript, C++, Arduino & MicroPython right in your browser.',
    href: '/playground',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Simulation Lab',
    description: '3D robot simulation environment to test movements, sensors, and obstacle avoidance.',
    href: '/simulation',
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: 'Game Arena',
    description: 'Compete in Robot Maze, Line Follower, Drone Navigation, and Robot Soccer challenges.',
    href: '/arena',
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: 'IoT Control Center',
    description: 'Control real ESP32 robots remotely — view sensor data, cameras, and send commands.',
    href: '/iot',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Competitions',
    description: 'Join national robotics competitions with team registration, judging, and leaderboards.',
    href: '/competitions',
  },
];

const testimonials = [
  {
    name: 'Mwila Chanda',
    role: 'Student, University of Zambia',
    quote: 'Robotix Institute transformed my understanding of robotics. The simulation lab and coding playground are incredible tools for learning.',
    avatar: 'MC',
  },
  {
    name: 'Natasha Mulenga',
    role: 'Instructor, Copperbelt University',
    quote: 'As an instructor, the LMS and competition platform have given my students hands-on experience that was never possible before.',
    avatar: 'NM',
  },
  {
    name: 'David Banda',
    role: 'IoT Engineer, Lusaka',
    quote: 'The IoT Control Center let me prototype and test my smart agriculture project remotely. This is the future of African tech education.',
    avatar: 'DB',
  },
];

const innovationProjects = [
  { title: 'Line Follower Robot', category: 'Robotics', image: '🤖' },
  { title: 'Smart Irrigation System', category: 'Agriculture IoT', image: '🌱' },
  { title: 'Robotic Arm Controller', category: 'Automation', image: '🦾' },
  { title: 'AI Object Detection', category: 'Computer Vision', image: '👁️' },
];

// ─── Home Page ──────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      {/* ─── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="circuit-overlay" />
        <Suspense fallback={null}>
          <HeroSceneErrorBoundary>
            <HeroScene />
          </HeroSceneErrorBoundary>
        </Suspense>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent z-[1]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-4">
                <Image
                  src="/images/icon-white.png"
                  alt="Robotix Institute emblem"
                  width={64}
                  height={64}
                  className="h-16 w-auto object-contain drop-shadow-lg"
                  priority
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <Badge variant="accent" className="mb-6">
                  <Zap className="w-3 h-3 mr-1" /> Zambia&apos;s #1 Robotics Platform
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Build the{' '}
                <span className="gradient-text">Future</span>
                <br />
                with Robotics
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-white/60 mb-8 max-w-lg"
              >
                Learn robotics, code intelligent machines, compete in challenges,
                and join Africa&apos;s most vibrant engineering community.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" icon={<Rocket className="w-5 h-5" />}>
                    Start Learning Free
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="secondary" size="lg" icon={<Play className="w-5 h-5" />}>
                    Explore Courses
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex items-center gap-6 mt-10 text-sm text-white/40"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['MC', 'NM', 'DB', 'SK'].map((initials, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-brand-secondary border-2 border-brand-dark flex items-center justify-center text-xs font-bold text-white"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span>2,500+ students learning</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                  ))}
                  <span className="ml-1">4.9/5</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ───────────────────────────────── */}
      <Section className="py-12 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 text-center shine-effect">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  {stat.icon}
                </div>
                <div className="text-3xl font-heading font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Platform Features ───────────────────────────── */}
      <Section withPattern>
        <SectionHeader
          badge="Platform Features"
          title="Everything You Need to Master Robotics"
          subtitle="From coding playgrounds to real robot control — our platform covers every aspect of robotics education."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {platformFeatures.map((feature, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Link href={feature.href}>
                <TiltCard tiltDegree={8} glareEnabled>
                  <div className="p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/50 mb-4">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-brand-accent font-medium">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ─── Featured Courses ────────────────────────────── */}
      <Section>
        <SectionHeader
          badge="Top Courses"
          title="Master Robotics & Engineering"
          subtitle="Expert-led courses designed for every skill level — from beginner to advanced."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredCourses.map((course, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard hover className="p-6 h-full flex flex-col shine-effect">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white mb-4`}>
                  {course.icon}
                </div>
                <Badge variant={course.level === 'Beginner' ? 'primary' : course.level === 'Intermediate' ? 'accent' : 'danger'} className="w-fit mb-3">
                  {course.level}
                </Badge>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-white/50 mb-4 flex-1">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-white/40">
                  <span>⏱ {course.duration}</span>
                  <Link
                    href="/courses"
                    className="text-brand-accent hover:text-brand-accent-light transition-colors flex items-center gap-1"
                  >
                    Enroll <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-10">
          <Link href="/courses">
            <Button variant="secondary" icon={<BookOpen className="w-4 h-4" />}>
              View All Courses
            </Button>
          </Link>
        </div>
      </Section>

      {/* ─── Innovation Lab Showcase ─────────────────────── */}
      <Section withPattern>
        <SectionHeader
          badge="Innovation Lab"
          title="Student Projects & Innovations"
          subtitle="See what our students are building — from smart agriculture to AI-powered robots."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {innovationProjects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover className="p-6 text-center">
                <div className="text-5xl mb-4">{project.image}</div>
                <Badge variant="primary" className="mb-2">{project.category}</Badge>
                <h3 className="font-heading font-semibold text-white">{project.title}</h3>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Competition Highlight ────────────────────────── */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="accent" className="mb-4">
              <Trophy className="w-3 h-3 mr-1" /> National Competitions
            </Badge>
            <h2 className="section-title mb-4">
              Compete at the Highest Level
            </h2>
            <p className="text-white/60 mb-6">
              Join Zambia&apos;s premier national robotics competitions. Form teams,
              submit projects, and compete for recognition as the best robotics
              engineers in the country.
            </p>
            <ul className="space-y-3 mb-8">
              {['Team registration & management', 'Project submission system', 'Expert judging panel', 'National leaderboard & awards'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-brand-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/competitions">
              <Button variant="primary" icon={<Trophy className="w-4 h-4" />}>
                View Competitions
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Zambia Robotics Challenge 2026
                </h3>
                <Badge variant="accent">Registration Open</Badge>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Teams Registered</span>
                  <span className="text-white font-semibold">47 / 100</span>
                </div>
                <ProgressBar value={47} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <div className="text-lg font-heading font-bold text-brand-accent">K50,000</div>
                    <div className="text-xs text-white/40">Prize Pool</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <div className="text-lg font-heading font-bold text-white">Apr 2026</div>
                    <div className="text-xs text-white/40">Start Date</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </Section>

      {/* ─── Testimonials ────────────────────────────────── */}
      <Section withPattern>
        <SectionHeader
          badge="Testimonials"
          title="What Our Community Says"
          subtitle="Hear from students, instructors, and engineers building with Robotix Institute."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                  ))}
                </div>
                <p className="text-white/70 text-sm mb-6 flex-1 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-xs font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-white/40">{testimonial.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── CTA Section ─────────────────────────────────── */}
      <Section>
        <GlassCard className="p-12 lg:p-16 text-center overflow-hidden noise-overlay">
          <div className="circuit-overlay" />
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-accent-light flex items-center justify-center shadow-glow-accent">
                <Rocket className="w-10 h-10 text-brand-dark" />
              </div>
              <h2 className="section-title mb-4">
                Ready to Build the Future?
              </h2>
              <p className="section-subtitle mx-auto mb-8">
                Join thousands of students across Zambia and Africa who are learning
                robotics, coding, and engineering on our platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" icon={<Zap className="w-5 h-5" />}>
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="secondary" size="lg" icon={<GraduationCap className="w-5 h-5" />}>
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </Section>

      <Footer />
    </main>
  );
}
