import { useEffect, useState } from 'react';
import { getVisitorId, recordVisit } from '../services/visitor';

/**
 * Module-level shared state.
 *
 * Because <VisitorCount /> is rendered in both Hero and Footer, all hook
 * instances must share a single fetch result. We store it here at module scope
 * so every caller reads the same value regardless of which component mounted
 * first. The `listeners` Set lets us notify every mounted instance when the
 * fetch completes.
 *
 * This intentionally avoids localStorage/sessionStorage — the backend is the
 * source of truth for deduplication. This cache is only for the current page
 * session in memory.
 */
let initiated = false;
let cachedCount = null;       // number | null
let cachedError = null;       // string | null
let fetchComplete = false;
const listeners = new Set();  // Set of setState callbacks

function notifyAll() {
  listeners.forEach((fn) => fn({ count: cachedCount, error: cachedError }));
}

async function fetchVisitorCount() {
  if (initiated) return;
  initiated = true;

  try {
    if (import.meta.env.DEV) {
      console.log('[VisitorCounter] Visitor fingerprint initializing\u2026');
    }

    const visitorId = await getVisitorId();
    const totalVisitors = await recordVisit(visitorId);

    cachedCount = totalVisitors;

    if (import.meta.env.DEV) {
      console.log('[VisitorCounter] Visitor count request completed.');
    }
  } catch (err) {
    cachedError = 'unavailable';
    if (import.meta.env.DEV) {
      console.warn('[VisitorCounter] Failed to record visit:', err.message);
    }
  } finally {
    fetchComplete = true;
    notifyAll();
  }
}

/**
 * useVisitorCount
 *
 * Returns the shared, module-level visitor count state. Safe to call from
 * multiple component instances — only one HTTP request is ever made per page
 * session.
 *
 * @returns {{ visitorCount: number|null, loading: boolean, error: string|null }}
 */
export function useVisitorCount() {
  const [state, setState] = useState({
    count: cachedCount,
    error: cachedError,
  });

  const loading = !fetchComplete;
  const visitorCount = state.count;
  const error = state.error;

  useEffect(() => {
    // If the fetch already finished before this component mounted, do nothing —
    // the initial useState already read the cached values.
    if (fetchComplete) return;

    // Subscribe to be notified when the fetch completes.
    listeners.add(setState);

    // Kick off the fetch (no-op if another instance already started it).
    fetchVisitorCount();

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return { visitorCount, loading, error };
}
