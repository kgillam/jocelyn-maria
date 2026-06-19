import { useEffect } from 'react';

// Tracks which intro animations have already run during this page load.
// Module state resets on a full document load (refresh) but persists across
// client-side route changes — so an intro plays on load/refresh but not when
// navigating back to a page within the SPA.
const played = new Set<string>();

export function useIntroOnce(key: string): boolean {
  const shouldPlay = !played.has(key);

  useEffect(() => {
    // Defer marking as played so React StrictMode's dev remount still sees the
    // intro as unplayed (the cleanup cancels the first, paired mount's timer).
    const timer = setTimeout(() => {
      played.add(key);
    }, 0);
    return () => clearTimeout(timer);
  }, [key]);

  return shouldPlay;
}
