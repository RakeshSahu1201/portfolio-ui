# Portfolio UI

A personal portfolio built with **React 18 + Vite**, deployed on **Vercel**.

---

## Development

```bash
# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values.

| Variable | Required | Description |
|---|---|---|
| `VITE_VISITOR_API_URL` | For visitor counter | Backend API base URL — see below |
| `RESEND_API_KEY` | For contact form | Resend API key (server-side only) |
| `RESEND_FROM_EMAIL` | For contact form | Sender address |
| `CONTACT_TO_EMAIL` | For contact form | Recipient address |

> **Security**: `VITE_*` variables are embedded in the browser bundle. Only public URLs
> belong there — never API keys, database credentials, or secrets.

---

## Anonymous Visitor Counter

### How it works

This portfolio includes a non-critical, anonymous visitor counter powered by the
open-source [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs) library and **Neon PostgreSQL**.

1. **Client-side fingerprint** — On load, FingerprintJS generates a `visitorId` by
   combining browser signals (user-agent, screen, fonts, canvas, etc.) into a hash.
   This is done entirely in the browser — no server call is needed to generate it.

2. **POST to backend** — The `visitorId` is sent to the Vercel Serverless Function `/api/visitor`:
   ```
   POST /api/visitor
   { "visitorId": "<hash>" }
   ```

3. **Backend deduplication (PostgreSQL)** — The Vercel function inserts the `visitorId` into a Neon PostgreSQL database using `ON CONFLICT DO NOTHING`.
   The frontend only displays what the backend returns.
   ```json
   { "success": true, "uniqueVisitors": 1284, "isNewVisitor": true }
   ```

4. **Display** — The total visitor count appears in the Hero section:
   `👥 1,284 visitors`

### Limitations and privacy notes

> ⚠️ **The `visitorId` is an approximate identifier.** FingerprintJS open-source
> fingerprinting is NOT guaranteed to uniquely identify a physical person or device.
> It can produce false positives (same person counted twice) or false negatives (two
> people sharing a fingerprint counted as one). Do not rely on it for security, billing,
> or precise analytics.

- The raw `visitorId` is **never displayed** in the UI.
- The frontend does **not** store the `visitorId` in localStorage, sessionStorage, or
  cookies — it is only held in memory for the duration of the request.
- The backend is responsible for all deduplication logic via PostgreSQL primary key constraints.

### Graceful degradation

The visitor counter is **non-critical**. If the API is unreachable, returns an error,
or FingerprintJS fails to initialise, the component renders nothing and the rest of the
portfolio is completely unaffected.

---

## Configuring PostgreSQL (Neon)

The backend requires a PostgreSQL database to store the unique visitors.

### Local development

1. Create a Neon development database (or use any local PostgreSQL database).
2. Add the connection string to `.env.local`:
   ```
   DATABASE_URL=postgres://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb
   ```
3. Run `vercel dev`. The API routes under `/api/*` will automatically use this database.

### Vercel deployment

In the Vercel dashboard:

1. Navigate to your project's **Storage** tab or **Integrations** tab.
2. Connect the **Neon** integration.
3. This automatically injects the required `DATABASE_URL` into your Vercel Environment Variables.
4. The tables will be automatically created on the first API request.

---

## Project Structure

```
api/
├── contact.js              # Contact form email handler
├── visitor.js              # POST /api/visitor (records visits)
└── visitor/
    └── count.js            # GET /api/visitor/count (gets total count)
src/
├── components/
│   ├── Hero.jsx            # Hero section — renders VisitorCount
│   ├── VisitorCount.jsx    # Visitor count display (👥 N visitors)
│   └── ...
├── hooks/
│   ├── useApi.js           # Contact form hook
│   └── useVisitorCount.js  # Visitor counter hook
├── services/
│   └── visitor.js          # FingerprintJS init + visitor API calls
└── ...
```
