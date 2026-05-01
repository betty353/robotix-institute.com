import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, SectionHeader, GlassCard, Badge, Button } from '@/components/ui';
import { Rocket, Target, Heart, Users, GraduationCap, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Robotix Institute is Zambia\'s premier robotics education platform — empowering Africa\'s next generation of engineers, makers, and innovators.',
};

const values = [
  { icon: Rocket, title: 'Hands-on First', desc: 'We believe robotics is best learned by building real robots, not just reading about them.' },
  { icon: Heart, title: 'Inclusive Access', desc: 'Quality STEM education for every child in Zambia, regardless of background or budget.' },
  { icon: Globe, title: 'Africa-Focused', desc: 'Curriculum and projects designed for African contexts — agriculture, water, energy.' },
  { icon: Target, title: 'Outcome-driven', desc: 'Every course leads to a competition, certificate, or working portfolio project.' },
];

const stats = [
  { value: '2,500+', label: 'Active Students' },
  { value: '120+', label: 'Robot Projects' },
  { value: '45+', label: 'Expert Courses' },
  { value: '15+', label: 'National Awards' },
];

export default function AboutPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">About Robotix Institute</Badge>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
            Building <span className="gradient-text">Africa&apos;s Future</span> Engineers
          </h1>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            Robotix Institute is Zambia&apos;s premier robotics education platform. We blend
            physical robotics kits, online courses, an in-browser code playground,
            interactive games, and real IoT control to give every student a complete,
            hands-on path from beginner to engineer.
          </p>
        </div>
      </section>

      <Section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-6 text-center">
              <p className="text-3xl font-heading font-bold text-brand-accent">{s.value}</p>
              <p className="text-sm text-white/40 mt-1">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section withPattern>
        <SectionHeader badge="Our Mission" title="What we believe" />
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v) => (
            <GlassCard key={v.title} className="p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-3">
                <v.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-white mb-1">{v.title}</h3>
              <p className="text-sm text-white/60">{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section>
        <GlassCard className="p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-brand-accent" />
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Join the community</h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            Whether you&apos;re a curious 8-year-old or a university engineer, there&apos;s a place for you here.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register"><Button icon={<GraduationCap className="w-4 h-4" />}>Create Free Account</Button></Link>
            <Link href="/contact"><Button variant="secondary">Get in Touch</Button></Link>
          </div>
        </GlassCard>
      </Section>

      <Footer />
    </main>
  );
}
