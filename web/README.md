# Invoice Preview Frontend (React 18 + Vite)

This folder contains the React 18 frontend for the full-stack test assignment.

The backend API is a separate application/repository and must be running before the frontend can load data or preview invoices.

## Prerequisites

- Node.js + npm installed
- The backend API running and reachable from your machine

## Run locally

From the `web/` folder:

```bash
npm install
npm run dev
```

Vite will print the local dev server URL (typically `http://localhost:5173`).

## Environment variables

The frontend reads the backend base URL from:

- `VITE_API_BASE_URL` — base URL for the backend API (no trailing slash required)

See `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5093
```

Recommended setup:

```bash
copy .env.example .env.local
```

Then adjust `VITE_API_BASE_URL` if your backend uses a different host/port.

## Backend dependency

This frontend expects the backend to expose these routes (lowercase):

- `GET /api/students`
- `GET /api/courses`
- `POST /api/invoices/preview`

If you see network errors in the UI, verify:

- The backend is running
- `VITE_API_BASE_URL` points to it
- CORS is configured on the backend to allow the Vite dev server origin

## Assumptions / limitations

- No authentication/authorization is implemented in the frontend.
- Data is fetched fresh from the backend API on page load; there is no offline mode.
- The UI is a minimal preview workflow (select student + course → preview); it does not create or persist invoices.
