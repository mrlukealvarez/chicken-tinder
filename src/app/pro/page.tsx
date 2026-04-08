'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserId } from '@/lib/utils';
import { ChefHat, Crown, Zap, Filter, Star, Heart, ArrowLeft } from 'lucide-react';

const FEATURES = [
  { icon: Zap, label: 'Unlimited sessions', desc: 'No daily limits' },
  { icon: Filter, label: 'Cuisine filters', desc: 'Thai, Italian, Sushi...' },
  { icon: Star, label: 'Super Cluck', desc: 'Highlight your top pick' },
  { icon: Heart, label: 'Session history', desc: 'Revisit past matches' },
];

function ProContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('cancelled');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    setLoading(true);
    setError('');
    try {
      const userId = getUserId();
      const res = await fetch('/api/stripe?action=checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          returnUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Stripe not configured yet. Coming soon!');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col min-h-dvh page-enter">
      {/* Header */}
      <div className="flex items-center px-4 py-3 shrink-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-sm text-[var(--ct-text-dim)] hover:text-[var(--ct-primary)]"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Pro badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--ct-accent)] to-[#ff9500] mb-4">
            <Crown size={40} className="text-[var(--ct-bg)]" />
          </div>
          <h1 className="text-3xl font-black mb-2">
            Chicken<span className="text-[var(--ct-accent)]">Pro</span>
          </h1>
          <p className="text-[var(--ct-text-dim)]">Unlimited swipes. Better dates.</p>
        </div>

        {cancelled && (
          <div className="mb-4 px-4 py-2 bg-[var(--ct-surface)] rounded-xl text-sm text-[var(--ct-text-dim)]">
            No worries! You can upgrade anytime.
          </div>
        )}

        {/* Features */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-4 p-4 bg-[var(--ct-surface)] rounded-xl border border-[var(--ct-border)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--ct-accent)]/10 flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-[var(--ct-accent)]" />
              </div>
              <div>
                <p className="font-bold text-sm">{f.label}</p>
                <p className="text-xs text-[var(--ct-text-dim)]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="w-full max-w-sm text-center">
          <div className="mb-4">
            <span className="text-4xl font-black">$1.99</span>
            <span className="text-[var(--ct-text-dim)]">/month</span>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-[var(--ct-accent)] to-[#ff9500] text-[var(--ct-bg)] rounded-2xl font-bold text-lg
                       flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                       hover:shadow-[0_0_30px_rgba(255,217,61,0.3)] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-[var(--ct-bg)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ChefHat size={22} />
                Upgrade to Pro
              </>
            )}
          </button>
          {error && (
            <p className="text-[var(--ct-secondary)] text-sm text-center mt-3">{error}</p>
          )}
          <p className="text-xs text-[var(--ct-text-dim)] mt-3">
            Cancel anytime. No commitment.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ProPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--ct-primary)] border-t-transparent rounded-full animate-spin" /></div>}>
      <ProContent />
    </Suspense>
  );
}
