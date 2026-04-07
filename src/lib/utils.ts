// Generate a fun 4-letter room code
const WORDS = [
  'TACO', 'SUSH', 'BURG', 'PIZZA', 'WING', 'FRIE', 'SOUP', 'RICE',
  'STEW', 'CAKE', 'ROLL', 'CHOP', 'GRIL', 'BAKE', 'BREW', 'CHAR',
  'MELT', 'WRAP', 'BOWL', 'BITE', 'FEST', 'NOMS', 'YUMS', 'GRUB',
  'CHOW', 'EATS', 'DISH', 'FORK', 'CHEF', 'COOK', 'ZEST', 'TANG',
];

export function generateRoomCode(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return 'Nearby';
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
  return `${miles.toFixed(1)} mi`;
}

export function priceToSymbol(level: number): string {
  return '$'.repeat(Math.max(1, Math.min(4, level)));
}

export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('chicken-tinder-uid');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('chicken-tinder-uid', id);
  }
  return id;
}
