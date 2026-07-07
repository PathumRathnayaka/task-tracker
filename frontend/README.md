# Task Tracker — Frontend

React 19 + TypeScript single-page app for the Task Tracker API. See the
[root README](../README.md) for the full project overview.

## Scripts

```bash
npm install
npm run dev       # start the dev server on http://localhost:5173
npm run build     # type-check and build for production
npm run lint      # run oxlint
```

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_API_BASE_URL` — base URL of the REST API
- `VITE_WS_URL` — SockJS WebSocket endpoint

## Structure

- `src/features` — feature modules (auth, tasks, admin) with their API and hooks
- `src/components` — shared UI and layout components
- `src/pages` — routed pages
- `src/lib` — API client, token storage, and WebSocket setup
