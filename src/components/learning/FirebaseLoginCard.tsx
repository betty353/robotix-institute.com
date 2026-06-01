'use client';

import { FormEvent, useState } from 'react';
import { Lock, LogIn, LogOut, Mail } from 'lucide-react';
import { Badge, Button, GlassCard, Input } from '@/components/ui';
import { isFirebaseConfigured, signInWithFirebaseEmail, signInWithGoogle, signOutFirebase } from '@/lib/firebase';
import { useLearningProfile } from '@/components/learning/useLearningProfile';

export function FirebaseLoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useLearningProfile();
  const [status, setStatus] = useState(isFirebaseConfigured() ? 'Firebase Auth ready' : 'Firebase Auth not configured');
  const [loading, setLoading] = useState(false);
  const firebaseReady = isFirebaseConfigured();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signInWithFirebaseEmail(email, password);
      setStatus('Signed in for this learning session');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-brand-accent" />
          <h2 className="font-heading text-lg font-bold">Firebase login</h2>
        </div>
        <Badge variant={firebaseReady ? 'success' : 'danger'}>{firebaseReady ? 'Live' : 'Setup needed'}</Badge>
      </div>
      {user ? (
        <div className="space-y-3">
          <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-100">
            Signed in as {user.email || user.displayName}
          </p>
          <Button type="button" size="sm" variant="secondary" onClick={() => signOutFirebase()} icon={<LogOut className="h-4 w-4" />}>
            Sign out
          </Button>
        </div>
      ) : (
      <form onSubmit={submit} className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="student@example.com"
          icon={<Mail className="h-4 w-4" />}
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          icon={<Lock className="h-4 w-4" />}
          required
        />
        <Button type="submit" size="sm" loading={loading} disabled={!firebaseReady} icon={<LogIn className="h-4 w-4" />}>
          Sign in
        </Button>
        <Button type="button" size="sm" variant="secondary" disabled={!firebaseReady} onClick={() => signInWithGoogle()} icon={<LogIn className="h-4 w-4" />}>
          Google
        </Button>
      </form>
      )}
      {!firebaseReady ? (
        <p className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-100">
          Add valid `NEXT_PUBLIC_FIREBASE_*` values to enable Firebase login, progress sync, and saved learning state.
        </p>
      ) : null}
      <p className="mt-3 text-xs text-white/45">{status}</p>
    </GlassCard>
  );
}
