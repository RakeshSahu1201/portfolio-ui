import React from 'react';
import { useVisitorCount } from '../hooks/useVisitorCount';

/**
 * VisitorCount
 *
 * Displays the total anonymous visitor count returned by the backend.
 * Three render states:
 *   - loading  → "👥 Loading..."
 *   - success  → "👥 1,284 visitors"
 *   - error    → renders nothing (visitor count is non-critical)
 *
 * Styled to match the Hero section's prompt/location aesthetic:
 * monospace font, muted colour, small font-size.
 */
export default function VisitorCount({ customStyle = {} }) {
  const { visitorCount, loading, error } = useVisitorCount();

  // Silent failure: if unavailable, don't disturb the layout.
  if (error) return null;

  const style = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    marginTop: 16,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    animation: 'fadeUp 0.6s ease 0.6s both',
    opacity: loading ? 0.5 : 1,
    transition: 'opacity 0.3s ease',
    ...customStyle,
  };

  const label = loading
    ? '👥 Loading...'
    : `👥 ${visitorCount !== null ? visitorCount.toLocaleString() : '—'} visitors`;

  return (
    <p style={style} aria-live="polite" aria-label={label}>
      {label}
    </p>
  );
}
