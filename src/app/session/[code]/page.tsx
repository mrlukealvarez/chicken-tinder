'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TinderCard from 'react-tinder-card';
import { getUserId } from '@/lib/utils';
import { Restaurant, Session } from '@/types';
import SwipeCard from '@/components/SwipeCard';
import ActionButtons from '@/components/ActionButtons';
import { Share2, Copy, Check, Users, ChefHat } from 'lucide-react';

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();
  const userId = typeof window !== 'undefined' ? getUserId() : '';

  const [session, setSession] = useState<Session | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [swipedCount, setSwipedCount] = useState(0);
  const cardRefs = useRef<Array<{ swipe: (dir: string) => Promise<void>; restoreCard: () => Promise<void> } | null>>([]);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', code }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        if (currentIndex === -1 && data.session.restaurants.length > 0) {
          setCurrentIndex(data.session.restaurants.length - 1);
        }
      }
    } catch {
      // silent retry
    }
    setLoading(false);
  }, [code, currentIndex]);

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 3000);
    return () => clearInterval(interval);
  }, [fetchSession]);

  async function handleSwipe(direction: SwipeDirection, restaurant: Restaurant) {
    if (direction !== 'left' && direction !== 'right') return;

    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'swipe',
        sessionId: session!.id,
        userId,
        restaurantId: restaurant.id,
        direction,
      }),
    });

    setSwipedCount(prev => prev + 1);
    setCurrentIndex(prev => prev - 1);
  }

  function handleCardLeftScreen() {
    // Card has left screen, check if we're done
    if (currentIndex <= 0 && session) {
      // Done swiping, go to results
      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', code }),
      }).then(() => {
        router.push(`/results/${code}`);
      });
    }
  }

  function swipeManual(dir: 'left' | 'right') {
    if (currentIndex >= 0 && cardRefs.current[currentIndex]) {
      cardRefs.current[currentIndex]!.swipe(dir);
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--ct-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[var(--ct-secondary)] mb-4">Session not found</p>
        <button onClick={() => router.push('/')} className="text-[var(--ct-primary)]">Go home</button>
      </main>
    );
  }

  // Waiting for partner
  const isHost = session.hostId === userId;
  if (session.status === 'waiting' && isHost) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 page-enter">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--ct-surface)] mb-4 pulse-glow">
            <Users size={32} className="text-[var(--ct-primary)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Waiting for your partner</h2>
          <p className="text-[var(--ct-text-dim)]">Share this code with them</p>
        </div>

        <div className="bg-[var(--ct-surface)] rounded-2xl p-8 text-center mb-6 border border-[var(--ct-border)]">
          <p className="text-5xl font-black tracking-[0.3em] text-[var(--ct-primary)] mb-4">{code}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--ct-card)] rounded-xl text-sm hover:bg-[var(--ct-border)] transition-colors"
            >
              {copied ? <Check size={16} className="text-[var(--ct-primary)]" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={() => navigator.share({ title: 'Chicken Tinder', text: `Join my Chicken Tinder room: ${code}` })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--ct-card)] rounded-xl text-sm hover:bg-[var(--ct-border)] transition-colors"
              >
                <Share2 size={16} /> Share
              </button>
            )}
          </div>
        </div>

        <p className="text-[var(--ct-text-dim)] text-sm animate-pulse">
          Waiting for someone to join...
        </p>
      </main>
    );
  }

  // Swiping phase
  const restaurants = session.restaurants;
  const total = restaurants.length;
  const progress = Math.round((swipedCount / total) * 100);

  return (
    <main className="flex-1 flex flex-col max-h-dvh overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <ChefHat size={20} className="text-[var(--ct-primary)]" />
          <span className="font-bold text-sm">Room: {code}</span>
        </div>
        <div className="text-sm text-[var(--ct-text-dim)]">
          {swipedCount}/{total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 shrink-0">
        <div className="h-1 bg-[var(--ct-surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--ct-primary)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative mx-4 my-4">
        {restaurants.map((restaurant, index) => (
          <TinderCard
            ref={(el) => { cardRefs.current[index] = el as typeof cardRefs.current[0]; }}
            key={restaurant.id}
            onSwipe={(dir) => handleSwipe(dir as SwipeDirection, restaurant)}
            onCardLeftScreen={handleCardLeftScreen}
            preventSwipe={['up', 'down']}
            swipeRequirementType="position"
            swipeThreshold={100}
            className={`absolute inset-0 ${index === currentIndex ? 'z-10' : index === currentIndex - 1 ? 'z-0' : 'z-[-1]'}`}
          >
            <SwipeCard restaurant={restaurant} />
          </TinderCard>
        ))}

        {currentIndex < 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <p className="text-xl font-bold mb-2">All done!</p>
              <p className="text-[var(--ct-text-dim)]">Heading to results...</p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="shrink-0 pb-safe">
        <ActionButtons
          onSwipeLeft={() => swipeManual('left')}
          onSwipeRight={() => swipeManual('right')}
          disabled={currentIndex < 0}
        />
      </div>
    </main>
  );
}
