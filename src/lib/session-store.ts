import { Restaurant, Session, Swipe, Match } from '@/types';

// In-memory session store (replace with Supabase for production)
// This gives us a working MVP without requiring a database setup
const sessions = new Map<string, Session>();
const swipes = new Map<string, Swipe[]>(); // sessionId -> swipes

export function createSession(code: string, hostId: string, lat: number, lng: number, radius: number): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    code: code.toUpperCase(),
    hostId,
    lat,
    lng,
    radius,
    restaurants: [],
    status: 'waiting',
    createdAt: new Date().toISOString(),
  };
  sessions.set(session.code, session);
  swipes.set(session.id, []);
  return session;
}

export function joinSession(code: string, guestId: string): Session | null {
  const session = sessions.get(code.toUpperCase());
  if (!session) return null;
  if (session.guestId && session.guestId !== guestId) return null;
  session.guestId = guestId;
  session.status = 'swiping';
  return session;
}

export function getSession(code: string): Session | null {
  return sessions.get(code.toUpperCase()) || null;
}

export function setRestaurants(code: string, restaurants: Restaurant[]): void {
  const session = sessions.get(code.toUpperCase());
  if (session) {
    session.restaurants = restaurants;
  }
}

export function addSwipe(sessionId: string, swipe: Swipe): void {
  const existing = swipes.get(sessionId) || [];
  existing.push(swipe);
  swipes.set(sessionId, existing);
}

export function getMatches(sessionId: string, hostId: string, guestId: string): Match[] {
  const sessionSwipes = swipes.get(sessionId) || [];
  const hostLikes = new Set(
    sessionSwipes.filter(s => s.odUserId === hostId && s.direction === 'right').map(s => s.restaurantId)
  );
  const guestLikes = new Set(
    sessionSwipes.filter(s => s.odUserId === guestId && s.direction === 'right').map(s => s.restaurantId)
  );

  // Find the session to get restaurant details
  let restaurants: Restaurant[] = [];
  for (const session of sessions.values()) {
    if (session.id === sessionId) {
      restaurants = session.restaurants;
      break;
    }
  }

  return restaurants
    .filter(r => hostLikes.has(r.id) || guestLikes.has(r.id))
    .map(r => ({
      restaurant: r,
      bothLiked: hostLikes.has(r.id) && guestLikes.has(r.id),
    }))
    .sort((a, b) => (b.bothLiked ? 1 : 0) - (a.bothLiked ? 1 : 0));
}

export function getUserSwipeCount(sessionId: string, userId: string): number {
  const sessionSwipes = swipes.get(sessionId) || [];
  return sessionSwipes.filter(s => s.odUserId === userId).length;
}

export function completeSession(code: string): void {
  const session = sessions.get(code.toUpperCase());
  if (session) {
    session.status = 'complete';
  }
}
