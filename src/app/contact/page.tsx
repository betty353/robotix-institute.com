'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, GlassCard, Badge, Button, Input, Textarea } from '@/components/ui';
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in name, email, and message.');
      return;
    }
    setSending(true);
    // No backend endpoint yet — for now, surface a friendly message and persist locally.
    try {
      const inbox = JSON.parse(localStorage.getItem('robotix-contact-inbox') || '[]');
      inbox.push({ name, email, subject, message, ts: new Date().toISOString() });
      localStorage.setItem('robotix-contact-inbox', JSON.stringify(inbox));
      toast.success("Thanks! We'll get back to you within 24 hours.");
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      toast.error('Something went wrong. Please email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="bg-brand-dark min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-4">Contact</Badge>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">Let&apos;s talk robotics</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Questions, partnerships, school visits, or competition entries — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <Section className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Office</p>
                <p className="text-sm font-semibold">Lusaka, Zambia</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Email</p>
                <a href="mailto:hello@robotixinstitute.co.zm" className="text-sm font-semibold hover:text-brand-accent">
                  hello@robotixinstitute.co.zm
                </a>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Phone</p>
                <p className="text-sm font-semibold">+260 97X XXX XXX</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-accent" /> Send a message
            </h2>
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                required
              />
              <Button type="submit" loading={sending} icon={<Send className="w-4 h-4" />}>
                Send Message
              </Button>
            </motion.form>
          </GlassCard>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
