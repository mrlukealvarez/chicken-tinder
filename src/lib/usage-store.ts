// In-memory usage tracking (replace with Supabase for production)
// Tracks daily session usage and Pro subscription status per user

const FREE_DAILY_LIMIT = 3;

// userId -> { date: 'YYYY-MM-DD', count: number }
const dailyUsage = new Map<string, { date: string; count: number }>();

// userId -> { active: boolean, stripeCustomerId?: string, subscriptionId?: string }
const proUsers = new Map<string, { active: boolean; stripeCustomerId?: string; subscriptionId?: string }>();

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getUsageToday(userId: string): number {
  const usage = dailyUsage.get(userId);
  if (!usage || usage.date !== todayKey()) return 0;
  return usage.count;
}

export function incrementUsage(userId: string): void {
  const today = todayKey();
  const usage = dailyUsage.get(userId);
  if (!usage || usage.date !== today) {
    dailyUsage.set(userId, { date: today, count: 1 });
  } else {
    usage.count++;
  }
}

export function canCreateSession(userId: string): { allowed: boolean; remaining: number; isPro: boolean } {
  const isPro = isProUser(userId);
  if (isPro) return { allowed: true, remaining: Infinity, isPro: true };

  const used = getUsageToday(userId);
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
  return { allowed: remaining > 0, remaining, isPro: false };
}

export function isProUser(userId: string): boolean {
  return proUsers.get(userId)?.active === true;
}

export function setProStatus(userId: string, active: boolean, stripeCustomerId?: string, subscriptionId?: string): void {
  proUsers.set(userId, { active, stripeCustomerId, subscriptionId });
}

export function getProStatus(userId: string) {
  return proUsers.get(userId) || { active: false };
}

export function findUserByCustomerId(customerId: string): string | null {
  for (const [userId, data] of proUsers) {
    if (data.stripeCustomerId === customerId) return userId;
  }
  return null;
}

export const FREE_LIMIT = FREE_DAILY_LIMIT;
