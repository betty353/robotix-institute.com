'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, Input, Textarea } from '@/components/ui';
import { robotixProfile } from '@/lib/robotix-profile';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';

const quickLinks = [
  { label: 'Official website', href: robotixProfile.website, external: true },
  { label: 'LinkedIn company page', href: robotixProfile.linkedin, external: true },
  { label: 'Verified company profile', href: '/about', external: false },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in name, email, and message.');
      return;
    }
    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || 'Something went wrong. Please use the direct email instead.');
      }
      setSubmittedRef(result?.data?.id || '');
      toast.success("Thanks! Your message is now in Robotix's shared inbox.");
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please use the direct email instead.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(87,212,255,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(122,168,255,0.18),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-5">
              Contact Robotix Institute ZM
            </Badge>
            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-white lg:text-6xl">
              Start the right conversation with the institute.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
              Reach Robotix Institute for school partnerships, learning programs, community initiatives, camps,
              media requests, and general enquiries using the institute&apos;s public contact channels.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <GlassCard className="p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Headquarters</div>
                <div className="mt-3 text-sm leading-6 text-white/78">{robotixProfile.headquarters}</div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Public hours</div>
                <div className="mt-3 text-sm leading-6 text-white/78">{robotixProfile.openHours}</div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Delivery mode</div>
                <div className="mt-3 text-sm leading-6 text-white/78">Secure server inbox</div>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="shine-effect p-6 lg:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Direct contact desk</p>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-white">Public institute details</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-brand-secondary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">Office</div>
                    <div className="mt-2 text-sm leading-6 text-white/78">{robotixProfile.address}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 text-brand-secondary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">Email</div>
                    <a href="mailto:info@robotixinstitute.io" className="mt-2 inline-block text-sm font-semibold text-white hover:text-brand-secondary">
                      info@robotixinstitute.io
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 text-brand-secondary" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">Phone lines</div>
                    <div className="mt-2 grid gap-2 text-sm font-semibold">
                      <a href="tel:+260956355117" className="text-white hover:text-brand-secondary">+260 956 355 117</a>
                      <a href="tel:+260774743071" className="text-white/72 hover:text-brand-secondary">+260 774 743 071</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <Section className="pt-8">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/12 text-brand-accent">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">Best for</p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold text-white">School and program enquiries</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
                  Parent questions, student admissions, camps, robotics classes, and scheduling support.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
                  School partnerships, CSR initiatives, club rollouts, and community learning collaborations.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
                  Media requests, public events, showcase opportunities, and institute profile verification.
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-brand-secondary" />
                  <div className="text-sm font-semibold text-white">Public hours</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/65">{robotixProfile.openHours}</p>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-brand-secondary" />
                  <div className="text-sm font-semibold text-white">Last profile verification</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/65">{robotixProfile.lastVerified}</p>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Programs people ask about</p>
              <div className="mt-5 space-y-3">
                {robotixProfile.programs.slice(0, 4).map((program) => (
                  <div key={program.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{program.title}</div>
                        <div className="mt-1 text-sm text-white/58">{program.audience}</div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/30" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/62">{program.detail}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="overflow-hidden p-0">
              <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(87,212,255,0.12),rgba(255,255,255,0.02))] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/12 text-brand-secondary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-white">Send a message</h2>
                    <p className="mt-1 text-sm text-white/58">
                      Share what you need and the team can route it to the right program or operations contact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
                <div className="p-6">
                  <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/40">
                    Delivery mode: secure server inbox
                  </p>
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={onSubmit}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
                      <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="School partnership, class enquiry, media request..." />
                    <Textarea
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you need help with and any useful context."
                      required
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button type="submit" loading={sending} icon={<Send className="h-4 w-4" />}>
                        Send Message
                      </Button>
                      {submittedRef ? <p className="text-xs text-white/45">Reference: {submittedRef}</p> : null}
                    </div>
                  </motion.form>
                </div>

                <div className="border-t border-white/10 bg-white/[0.03] p-6 lg:border-t-0 lg:border-l">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">Helpful context</div>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="text-sm font-semibold text-white">Preferred direct route</div>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        For faster handling, use the form for detailed enquiries and use the public phone lines for urgent coordination.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="text-sm font-semibold text-white">What to include</div>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        Mention the learner age group, program interest, school name, preferred dates, or media deadline where relevant.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="text-sm font-semibold text-white">Public coverage</div>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        This page is based on the institute&apos;s publicly listed information and verified profile references.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-4 md:grid-cols-2">
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Useful next links</p>
                <div className="mt-5 space-y-3 text-sm">
                  {quickLinks.map((link) => (
                    link.external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/74 transition-all hover:border-white/20 hover:text-brand-secondary"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/74 transition-all hover:border-white/20 hover:text-brand-secondary"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Primary public channels</p>
                <div className="mt-5 space-y-3">
                  {robotixProfile.contacts.map((contact) => (
                    <a
                      key={contact.value}
                      href={contact.href}
                      className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20"
                    >
                      <div className="text-sm font-semibold text-white">{contact.value}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">{contact.label}</div>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
