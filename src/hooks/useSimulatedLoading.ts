import { useEffect, useState } from 'react';

/**
 * Returns true for a brief window on mount, then false. Every list page's
 * data is synchronous mock data with nothing to actually wait for, but a
 * real API-backed version of this page would have a network round-trip
 * here — this gives DataTable's skeleton rows a real, brief moment to
 * appear on first visit instead of sitting unused.
 */
export function useSimulatedLoading(durationMs = 450): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), durationMs);
    return () => clearTimeout(timeout);
  }, [durationMs]);

  return isLoading;
}
