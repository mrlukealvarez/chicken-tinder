import { NextRequest, NextResponse } from 'next/server';
import {
  createSession,
  joinSession,
  getSession,
  setRestaurants,
  addSwipe,
  getMatches,
  getUserSwipeCount,
  completeSession,
} from '@/lib/session-store';
import { canCreateSession, incrementUsage } from '@/lib/usage-store';
import { generateRoomCode } from '@/lib/utils';

export const preferredRegion = 'iad1';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'create': {
      const { hostId, lat, lng, radius } = body;
      const usage = canCreateSession(hostId);
      if (!usage.allowed) {
        return NextResponse.json({
          error: 'daily_limit',
          remaining: 0,
          isPro: false,
        }, { status: 429 });
      }
      const code = generateRoomCode();
      const session = createSession(code, hostId, lat || 43.7666, lng || -103.5988, radius || 5000);
      incrementUsage(hostId);
      return NextResponse.json({ session, remaining: usage.remaining - 1, isPro: usage.isPro });
    }

    case 'join': {
      const { code, guestId } = body;
      const session = joinSession(code, guestId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found or full' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    case 'get': {
      const { code } = body;
      const session = getSession(code);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    case 'setRestaurants': {
      const { code, restaurants } = body;
      setRestaurants(code, restaurants);
      return NextResponse.json({ ok: true });
    }

    case 'swipe': {
      const { sessionId, userId, restaurantId, direction } = body;
      addSwipe(sessionId, { sessionId, odUserId: userId, restaurantId, direction });
      return NextResponse.json({ ok: true });
    }

    case 'matches': {
      const { sessionId, hostId, guestId } = body;
      const matches = getMatches(sessionId, hostId, guestId);
      return NextResponse.json({ matches });
    }

    case 'swipeCount': {
      const { sessionId, userId } = body;
      const count = getUserSwipeCount(sessionId, userId);
      return NextResponse.json({ count });
    }

    case 'complete': {
      const { code } = body;
      completeSession(code);
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
