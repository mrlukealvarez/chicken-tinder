'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/lib/utils';
import { ChefHat, Users, ArrowRight, Sparkles, Crown } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'home' | 'join'>('home');

  async function handleCreate() {
    setIsCreating(true);
    setError('');
    try {
      const userId = getUserId();
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', hostId: userId }),
      });
      const data = await res.json();
      if (data.error === 'daily_limit') {
        router.push('/pro');
        return;
      }
      if (data.session) {
        const restRes = await fetch(`/api/restaurants?lat=${data.session.lat}&lng=${data.session.lng}&radius=${data.session.radius}`);
        const restData = await restRes.json();
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'setRestaurants', code: data.session.code, restaurants: restData.restaurants }),
        });
        router.push(`/session/${data.session.code}`);
      }
    } catch {
      setError('Failed to create session');
    }
    setIsCreating(false);
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    setError('');
    try {
      const userId = getUserId();
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', code: joinCode.trim(), guestId: userId }),
      });
      const data = await res.json();
      if (data.error) {
        setError('Room not found. Check the code and try again.');
      } else {
        router.push(`/session/${data.session.code}`);
      }
    } catch {
      setError('Failed to join session');
    }
    setIsJoining(false);
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 page-enter">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--ct-primary)] mb-4">
          <ChefHat size={40} className="text-[var(--ct-bg)]" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Chicken<span className="text-[var(--ct-primary)]">Tinder</span>
        </h1>
        <p className="text-[var(--ct-text-dim)] mt-2 text-lg">
          Swipe right on dinner together
        </p>
      </div>

      {mode === 'home' ? (
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full py-4 px-6 bg-[var(--ct-primary)] text-[var(--ct-bg)] rounded-2xl font-bold text-lg
                       flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                       hover:shadow-[0_0_30px_var(--ct-primary-glow)] disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-6 h-6 border-2 border-[var(--ct-bg)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={22} />
                Start a Session
              </>
            )}
          </button>

          <button
            onClick={() => setMode('join')}
            className="w-full py-4 px-6 border-2 border-[var(--ct-border)] text-[var(--ct-text)] rounded-2xl font-bold text-lg
                       flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                       hover:border-[var(--ct-primary)] hover:text-[var(--ct-primary)]"
          >
            <Users size={22} />
            Join a Session
          </button>

          {/* Pro upsell */}
          <button
            onClick={() => router.push('/pro')}
            className="w-full py-3 px-4 border border-[var(--ct-accent)]/30 rounded-2xl flex items-center justify-center gap-2
                       text-sm text-[var(--ct-accent)] hover:bg-[var(--ct-accent)]/5 transition-colors"
          >
            <Crown size={16} /> Upgrade to Pro - $1.99/mo
          </button>

          <div className="pt-6 text-center">
            <p className="text-[var(--ct-text-dim)] text-sm mb-4 font-medium uppercase tracking-wider">How it works</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">🍕</div>
                <p className="text-xs text-[var(--ct-text-dim)]">One person<br/>starts a room</p>
              </div>
              <div>
                <div className="text-2xl mb-1">👆</div>
                <p className="text-xs text-[var(--ct-text-dim)]">Both swipe on<br/>restaurants</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🎉</div>
                <p className="text-xs text-[var(--ct-text-dim)]">Match = that&apos;s<br/>dinner!</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm text-[var(--ct-text-dim)] mb-2 block">Enter room code</label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. TACO"
              maxLength={4}
              autoFocus
              className="w-full py-4 px-6 bg-[var(--ct-surface)] border-2 border-[var(--ct-border)] rounded-2xl
                         text-center text-3xl font-black tracking-[0.3em] text-[var(--ct-primary)]
                         placeholder:text-[var(--ct-text-dim)] placeholder:text-lg placeholder:tracking-normal placeholder:font-normal
                         focus:outline-none focus:border-[var(--ct-primary)]"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={isJoining || !joinCode.trim()}
            className="w-full py-4 px-6 bg-[var(--ct-primary)] text-[var(--ct-bg)] rounded-2xl font-bold text-lg
                       flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                       disabled:opacity-50"
          >
            {isJoining ? (
              <div className="w-6 h-6 border-2 border-[var(--ct-bg)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Join Room <ArrowRight size={20} />
              </>
            )}
          </button>

          <button
            onClick={() => { setMode('home'); setError(''); setJoinCode(''); }}
            className="w-full py-3 text-[var(--ct-text-dim)] text-sm hover:text-[var(--ct-text)]"
          >
            Back
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-[var(--ct-secondary)] text-sm text-center">{error}</p>
      )}
    </main>
  );
}
