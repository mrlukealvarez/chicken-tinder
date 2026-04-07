'use client';

import { Restaurant } from '@/types';
import { priceToSymbol } from '@/lib/utils';
import { Star, MapPin, Clock } from 'lucide-react';

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipe?: (direction: string) => void;
}

export default function SwipeCard({ restaurant }: SwipeCardProps) {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[var(--ct-card)] shadow-2xl swipe-card">
      {/* Restaurant Photo */}
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${restaurant.photo})`,
            backgroundColor: getPlaceholderColor(restaurant.cuisine),
          }}
        />
        {/* Gradient overlay */}
        <div className="card-gradient absolute inset-0" />

        {/* Like/Nope overlays */}
        <div className="absolute top-8 left-6 border-4 border-[var(--ct-primary)] rounded-xl px-4 py-2 rotate-[-20deg] opacity-0 transition-opacity like-stamp">
          <span className="text-[var(--ct-primary)] text-3xl font-black tracking-wider">YUM!</span>
        </div>
        <div className="absolute top-8 right-6 border-4 border-[var(--ct-secondary)] rounded-xl px-4 py-2 rotate-[20deg] opacity-0 transition-opacity nope-stamp">
          <span className="text-[var(--ct-secondary)] text-3xl font-black tracking-wider">NAH</span>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-1">
            {restaurant.isOpen && (
              <span className="flex items-center gap-1 text-xs text-[var(--ct-primary)] font-medium">
                <Clock size={12} /> Open
              </span>
            )}
            <span className="text-xs text-[var(--ct-text-dim)]">{restaurant.cuisine}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {restaurant.name}
          </h2>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-[var(--ct-accent)]">
              <Star size={14} fill="currentColor" />
              {restaurant.rating}
            </span>
            <span className="text-[var(--ct-text-dim)]">
              {priceToSymbol(restaurant.priceLevel)}
            </span>
            <span className="flex items-center gap-1 text-[var(--ct-text-dim)]">
              <MapPin size={14} />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPlaceholderColor(cuisine: string): string {
  const colors: Record<string, string> = {
    Steakhouse: '#8B4513',
    American: '#D2691E',
    Burgers: '#CD853F',
    Nordic: '#4682B4',
    Cafe: '#DEB887',
    BBQ: '#B22222',
    'Fine Dining': '#4B0082',
    Pizza: '#FF6347',
    Mexican: '#FF8C00',
    Sandwiches: '#DAA520',
  };
  return colors[cuisine] || '#444466';
}
