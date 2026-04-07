'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserId, priceToSymbol } from '@/lib/utils';
import { Match, Session } from '@/types';
import Confetti from '@/components/Confetti';
import { Star, MapPin, Navigation, RotateCcw, Heart, ChefHat } from 'lucide-react';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();

  const [session, setSession] = useState<Session | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function load() {
      const userId = getUserId();
      // Get session
      const sessionRes = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', code }),
      });
      const sessionData = await sessionRes.json();
      if (!sessionData.session) {
        setLoading(false);
        return;
      }
      setSession(sessionData.session);

      // Get matches
      const matchRes = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'matches',
          sessionId: sessionData.session.id,
          hostId: sessionData.session.hostId,
          guestId: sessionData.session.guestId || userId,
        }),
      });
      const matchData = await matchRes.json();
      setMatches(matchData.matches || []);

      // Show confetti if there are mutual matches
      const mutualMatches = (matchData.matches || []).filter((m: Match) => m.bothLiked);
      if (mutualMatches.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }

      setLoading(false);
    }
    load();
  }, [code]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--ct-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const mutualMatches = matches.filter(m => m.bothLiked);
  const yourLikes = matches.filter(m => !m.bothLiked);
  const topMatch = mutualMatches[0];

  return (
    <main className="flex-1 flex flex-col min-h-dvh page-enter">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <ChefHat size={20} className="text-[var(--ct-primary)]" />
          <span className="font-bold text-sm">Results</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-sm text-[var(--ct-text-dim)] hover:text-[var(--ct-primary)]"
        >
          <RotateCcw size={14} /> New Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Top Match Hero */}
        {topMatch ? (
          <div className="mb-8 text-center">
            <div className="match-pop">
              <p className="text-[var(--ct-primary)] font-bold text-sm uppercase tracking-wider mb-2">
                It&apos;s a match!
              </p>
              <h1 className="text-3xl font-black mb-2">{topMatch.restaurant.name}</h1>
              <div className="flex items-center justify-center gap-3 text-sm text-[var(--ct-text-dim)] mb-4">
                <span className="flex items-center gap-1 text-[var(--ct-accent)]">
                  <Star size={14} fill="currentColor" /> {topMatch.restaurant.rating}
                </span>
                <span>{priceToSymbol(topMatch.restaurant.priceLevel)}</span>
                <span>{topMatch.restaurant.cuisine}</span>
              </div>

              {/* Restaurant card */}
              <div className="relative rounded-2xl overflow-hidden h-48 mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundColor: '#333',
                    backgroundImage: `url(${topMatch.restaurant.photo})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-[var(--ct-text-dim)]" />
                  <span className="text-[var(--ct-text-dim)]">{topMatch.restaurant.address}</span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${topMatch.restaurant.lat},${topMatch.restaurant.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--ct-primary)] text-[var(--ct-bg)] rounded-xl font-bold transition-all hover:shadow-[0_0_30px_var(--ct-primary-glow)]"
              >
                <Navigation size={18} /> Get Directions
              </a>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center py-8">
            <p className="text-2xl mb-2">😅</p>
            <h2 className="text-xl font-bold mb-2">No mutual matches</h2>
            <p className="text-[var(--ct-text-dim)]">
              {session?.guestId
                ? "You and your partner didn't agree on any restaurants. Try again!"
                : "Waiting for your partner to finish swiping..."}
            </p>
          </div>
        )}

        {/* Other mutual matches */}
        {mutualMatches.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[var(--ct-text-dim)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Heart size={14} className="text-[var(--ct-primary)]" />
              More matches ({mutualMatches.length - 1})
            </h3>
            <div className="space-y-2">
              {mutualMatches.slice(1).map((match) => (
                <a
                  key={match.restaurant.id}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${match.restaurant.lat},${match.restaurant.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 bg-[var(--ct-surface)] rounded-xl border border-[var(--ct-border)] hover:border-[var(--ct-primary)] transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
                    style={{
                      backgroundColor: '#333',
                      backgroundImage: `url(${match.restaurant.photo})`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{match.restaurant.name}</p>
                    <p className="text-xs text-[var(--ct-text-dim)]">
                      {match.restaurant.cuisine} · {priceToSymbol(match.restaurant.priceLevel)} · {match.restaurant.distance}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--ct-accent)] text-sm">
                    <Star size={12} fill="currentColor" />
                    {match.restaurant.rating}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Individual likes */}
        {yourLikes.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[var(--ct-text-dim)] uppercase tracking-wider mb-3">
              One of you liked ({yourLikes.length})
            </h3>
            <div className="space-y-2">
              {yourLikes.map((match) => (
                <div
                  key={match.restaurant.id}
                  className="flex items-center gap-4 p-3 bg-[var(--ct-surface)] rounded-xl border border-[var(--ct-border)] opacity-60"
                >
                  <div
                    className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
                    style={{
                      backgroundColor: '#333',
                      backgroundImage: `url(${match.restaurant.photo})`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{match.restaurant.name}</p>
                    <p className="text-xs text-[var(--ct-text-dim)]">
                      {match.restaurant.cuisine} · {priceToSymbol(match.restaurant.priceLevel)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
