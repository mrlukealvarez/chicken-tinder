'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-[slide-up_0.3s_ease-out]">
      <div className="bg-[var(--ct-surface)] border border-[var(--ct-border)] rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-[var(--ct-primary)] flex items-center justify-center shrink-0">
          <Download size={20} className="text-[var(--ct-bg)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Install Chicken Tinder</p>
          <p className="text-xs text-[var(--ct-text-dim)]">Add to home screen for the full experience</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-[var(--ct-primary)] text-[var(--ct-bg)] rounded-xl text-sm font-bold shrink-0"
        >
          Install
        </button>
        <button onClick={() => setDismissed(true)} className="text-[var(--ct-text-dim)] shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
