'use client';

import { X, Heart, Star } from 'lucide-react';

interface ActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike?: () => void;
  disabled?: boolean;
}

export default function ActionButtons({ onSwipeLeft, onSwipeRight, onSuperLike, disabled }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Nah button */}
      <button
        onClick={onSwipeLeft}
        disabled={disabled}
        className="w-16 h-16 rounded-full border-2 border-[var(--ct-secondary)] flex items-center justify-center
                   transition-all active:scale-90 hover:bg-[var(--ct-secondary)] hover:text-white
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <X size={28} className="text-[var(--ct-secondary)]" />
      </button>

      {/* Super Cluck button */}
      {onSuperLike && (
        <button
          onClick={onSuperLike}
          disabled={disabled}
          className="w-12 h-12 rounded-full border-2 border-[var(--ct-accent)] flex items-center justify-center
                     transition-all active:scale-90 hover:bg-[var(--ct-accent)] hover:text-black
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Star size={20} className="text-[var(--ct-accent)]" />
        </button>
      )}

      {/* Yum button */}
      <button
        onClick={onSwipeRight}
        disabled={disabled}
        className="w-16 h-16 rounded-full border-2 border-[var(--ct-primary)] flex items-center justify-center
                   transition-all active:scale-90 hover:bg-[var(--ct-primary)] hover:text-black
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Heart size={28} className="text-[var(--ct-primary)]" />
      </button>
    </div>
  );
}
