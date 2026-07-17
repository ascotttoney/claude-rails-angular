# Woodworking Tool Inventory

A small Angular app for cataloging woodworking tools. It runs entirely in the
browser — tools are stored in `localStorage` — so it can be hosted for free as
a static site on GitHub Pages, with no server or database to run.

```
.
├── frontend/   # Angular app: tool table + add/edit/delete, localStorage-backed
└── backend/    # Legacy Rails API from earlier versions — no longer used (see below)
```

Each tool records a **name, category, brand, model, quantity, and location**.
Categories: Hand, Power, Clamps, Measuring, Sharpening, Safety, Fastening,
Finishing, Other.

## Prerequisites

- Node 20+ and npm

## Running locally

```bash
cd frontend
npm install
npm start          # alias for `ng serve`
```

Open http://localhost:4200 to manage your inventory. The list starts empty —
add your first tool from the form at the top.

## Data & storage

- Tools live in your browser's `localStorage` under the key
  `woodworking-tool-inventory`. Data is per-browser and per-device — it is not
  synced anywhere.
- Use **Export** (top right) to download the whole inventory as a JSON file for
  backup or transfer, and **Import** to load one back. Import replaces the
  current inventory.

## How it fits together

- `frontend/src/app/tool.service.ts` — CRUD over `localStorage`, plus
  export/import. Validates that `name` is present and `quantity` is a
  non-negative integer.
- `frontend/src/app/tools/` — the inventory component (table + form), rendered
  by `frontend/src/app/app.ts`.
- `frontend/src/styles.css` — Tailwind CSS v4 setup and the Instrument Serif
  typography.

## Deploying to GitHub Pages

Deployment is automated by `.github/workflows/deploy.yml`, which builds the
Angular app and publishes it on every push to `main`.

One-time setup: in the GitHub repo, go to **Settings → Pages** and set
**Source** to **GitHub Actions**. After the next push, the site is served at
`https://<your-username>.github.io/claude-rails-angular/`.

The workflow builds with `--base-href /claude-rails-angular/` so assets resolve
correctly under that subpath. If you rename the repository, update the
base-href in the workflow to match.

## About the legacy Rails backend

Earlier versions of this app used a Rails 8 API (`backend/`) with SQLite. The
app now stores data in the browser instead, so the backend is no longer used or
required. Its files are kept in the repository for reference and can be removed.
