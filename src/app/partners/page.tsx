import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button } from '@/components/ui';
import { Handshake, GraduationCap, Building2, Globe } from 'lucide-react';

export const metadata: Metadata = { title: 'Partnerships' };

export default function PartnersPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-3">
            <Handshake className="w-3 h-3 mr-1" /> Partnerships
          </Badge>
          <h1 className="font-heading text-4xl font-bold text-white mb-3">Build Africa&apos;s STEM future with us</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We work with schools, universities, NGOs, hardware suppliers, and corporates to expand robotics access across Zambia and Africa.
          </p>
        </div>
      </section>

      <Section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: GraduationCap, title: 'Schools', desc: 'Adopt our curriculum, get teacher training, run school competitions.' },
          { icon: Building2, title: 'Universities', desc: 'Industry-aligned electives, research collaborations, internship pipelines.' },
          { icon: Globe, title: 'NGOs / Foundations', desc: 'Sponsor scholarships, fund STEM access programs, co-host hackathons.' },
          { icon: Handshake, title: 'Corporates', desc: 'Talent pipeline, employer-branded courses, technical mentorship.' },
        ].map((p) => (
          <GlassCard key={p.title} className="p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-3">
              <p.icon className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-white mb-1">{p.title}</h3>
            <p className="text-sm text-white/60">{p.desc}</p>
          </GlassCard>
        ))}
      </Section>

      <Section>
        <GlassCard className="p-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Let&apos;s talk</h2>
          <p className="text-white/60 mb-5">Tell us about your organization and how we can collaborate.</p>
          <Link href="/contact"><Button>Start a Conversation</Button></Link>
        </GlassCard>
      </Section>
      <Footer />
    </main>
  );
}
