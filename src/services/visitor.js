/**
 * Visitor analytics service.
 *
 * Visitor identification uses the open-source FingerprintJS client-side browser
 * fingerprint. It is an approximate anonymous visitor identifier and is NOT
 * guaranteed to uniquely identify a physical person or device. The backend is
 * responsible for all deduplication logic; this service only supplies the identifier.
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Generates an anonymous visitor identifier using FingerprintJS.
 *
 * @returns {Promise<string>} The visitorId string.
 * @throws {Error} If FingerprintJS fails to load or generate an identifier.
 */
export async function getVisitorId() {
  // monitoring: false — we do not need FingerprintJS library usage telemetry.
  const fp = await FingerprintJS.load({ monitoring: false });
  const result = await fp.get();
  return result.visitorId;
}

/**
 * Posts the visitorId to the Vercel Function backend and returns the total visitor count.
 *
 * API contract (POST /api/visitor):
 *   Request body:  { "visitorId": "..." }
 *   Response body: { "success": true, "uniqueVisitors": 1284, "isNewVisitor": true }
 *
 * The backend is responsible for determining whether the identifier is new or
 * previously seen using PostgreSQL.
 *
 * @param {string} visitorId - The anonymous identifier from FingerprintJS.
 * @returns {Promise<number>} The total unique visitor count returned by the backend.
 * @throws {Error} If the API is unavailable, returns a non-2xx status, or the
 *                 response does not contain a numeric uniqueVisitors field.
 */
export async function recordVisit(visitorId) {
  const endpoint = '/api/visitor';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId }),
  });

  if (!response.ok) {
    throw new Error(`Visitor API responded with HTTP ${response.status}`);
  }

  const data = await response.json().catch(() => {
    throw new Error('Visitor API returned a malformed response.');
  });

  if (typeof data.uniqueVisitors !== 'number') {
    throw new Error('Visitor API response missing uniqueVisitors field.');
  }

  return data.uniqueVisitors;
}
