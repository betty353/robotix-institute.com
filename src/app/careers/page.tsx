import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, EmptyState } from '@/components/ui';
import { Briefcase, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = { title: 'Careers' };

const jobs: { title: string; type: string; location: string; href: string }[] = [
  // Add openings here when hiring
];

export default function CareersPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-3">
            <Briefcase className="w-3 h-3 mr-1" /> Careers
          </Badge>
          <h1 className="font-heading text-4xl font-bold text-white mb-3">
            Help us teach a million African engineers
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We&apos;re a small, fast-moving team building the most advanced robotics learning platform on the continent.
          </p>
        </div>
      </section>

      <Section>
        {jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-8 h-8" />}
            title="No open roles right now"
            description="We're always interested in hearing from passionate educators and engineers. Send us a note!"
            action={<Link href="/contact"><Button>Get in Touch</Button></Link>}
          />
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <GlassCard key={j.title} className="p-5 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-white">{j.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {j.type}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.location}</span>
                  </div>
                </div>
                <Link href={j.href}><Button variant="secondary" size="sm">Apply</Button></Link>
              </GlassCard>
            ))}
          </div>
        )}
      </Section>
      <Footer />
    </main>
  );
}
