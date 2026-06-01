'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge, GlassCard } from '@/components/ui';
import type { WeekendClassLead } from '@/lib/firebase';
import { useAuthStore } from '@/store';
import { formatDate } from '@/lib/utils';
import {
  CalendarDays,
  Clock3,
  Mail,
  Server,
  Shield,
  UserRound,
  Users,
} from 'lucide-react';

function getLeadDate(value: WeekendClassLead['createdAt']) {
  if (!value) return 'Unscheduled';
  if (typeof value === 'string') return formatDate(value);
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return formatDate(value.toDate());
  }
  return 'Unscheduled';
}

export default function AdminWeekendLeads() {
  const token = useAuthStore((state) => state.token);
  const [leads, setLeads] = useState<WeekendClassLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setLoadError('Admin sign-in is required to load weekend class leads.');
      return;
    }

    let cancelled = false;

    const loadLeads = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await fetch('/api/weekend-class-leads?limit=50', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json?.message || 'Weekend sign-ups could not be loaded.');
        }
        if (!cancelled) {
          setLeads(Array.isArray(json?.data) ? json.data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Weekend sign-ups could not be loaded.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLeads();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const summary = useMemo(
    () => ({
      total: leads.length,
      robotics: leads.filter((lead) => lead.preferredTrack === 'robotics-foundations').length,
      coding: leads.filter((lead) => lead.preferredTrack === 'coding-and-games').length,
      flexible: leads.filter((lead) => lead.preferredSchedule === 'weekend-flexible').length,
    }),
    [leads]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total parent leads', value: summary.total.toString(), icon: Users },
          { label: 'Robotics interest', value: summary.robotics.toString(), icon: Shield },
          { label: 'Coding interest', value: summary.coding.toString(), icon: Mail },
          { label: 'Flexible weekend asks', value: summary.flexible.toString(), icon: Clock3 },
        ].map((item) => (
          <GlassCard key={item.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent">
                <item.icon className="h-5 w-5" />
              </div>
              <Badge variant="primary" className="text-[10px] uppercase tracking-[0.2em]">
                Server
              </Badge>
            </div>
            <div className="mt-5 text-3xl font-bold">{item.value}</div>
            <div className="mt-2 text-sm font-medium text-white/80">{item.label}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-3">
              <UserRound className="mr-1 h-3 w-3" />
              Parent Lead Inbox
            </Badge>
            <h3 className="font-heading text-2xl font-semibold">Weekend class sign-ups from parents</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">
              This panel gives administrators the parent contact details, child learning preferences, and scheduling signals coming from the weekend-classes page.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <Server className="h-4 w-4 text-brand-secondary" />
              Server-backed capture active
            </span>
          </div>
        </div>

        {loadError ? (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            {loadError}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-sm text-white/58">
            Loading weekend sign-ups...
          </div>
        ) : null}

        {!loading && leads.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-sm leading-6 text-white/58">
            No parent sign-ups have been captured yet. Once parents submit the weekend form, their details will show up here for follow-up.
          </div>
        ) : null}

        {!loading && leads.length > 0 ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {leads.map((lead) => (
              <GlassCard key={lead.id} className="p-5 school-lift">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-brand-secondary">Parent lead</div>
                    <h4 className="mt-2 font-heading text-xl font-semibold">{lead.parentName}</h4>
                    <p className="mt-1 text-sm text-white/55">
                      Child: {lead.childName} {lead.childAge ? `- age ${lead.childAge}` : ''}
                    </p>
                  </div>
                  <Badge variant="primary" className="text-[10px] uppercase tracking-[0.2em]">
                    {lead.preferredTrack || 'Track pending'}
                  </Badge>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/62">
                    <div className="mb-2 flex items-center gap-2 text-white">
                      <Mail className="h-4 w-4 text-brand-secondary" />
                      <span className="font-semibold">Contact</span>
                    </div>
                    <a href={`mailto:${lead.parentEmail}`} className="block hover:text-brand-secondary">
                      {lead.parentEmail}
                    </a>
                    <a href={`tel:${lead.parentPhone.replace(/\s+/g, '')}`} className="block hover:text-brand-secondary">
                      {lead.parentPhone}
                    </a>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/62">
                    <div className="mb-2 flex items-center gap-2 text-white">
                      <CalendarDays className="h-4 w-4 text-brand-secondary" />
                      <span className="font-semibold">Schedule</span>
                    </div>
                    <div>{lead.preferredSchedule}</div>
                    <div className="mt-2 text-white/45">Received {getLeadDate(lead.createdAt)}</div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-white/62">
                  <div className="mb-2 flex items-center gap-2 text-white">
                    <Users className="h-4 w-4 text-brand-secondary" />
                    <span className="font-semibold">Learning details</span>
                  </div>
                  <p>School: {lead.childSchool || 'Not shared'}</p>
                  <p className="mt-2">Notes: {lead.notes || 'No extra notes shared.'}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : null}
      </GlassCard>
    </div>
  );
}
