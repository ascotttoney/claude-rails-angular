# Woodworking Tool Inventory

A small full-stack app for cataloging woodworking tools: a Rails 8 API backend
backed by SQLite, and an Angular frontend for browsing, adding, editing, and
deleting tools.

```
.
├── backend/    # Rails 8 API-only app (CRUD under /api/tools, SQLite)
└── frontend/   # Angular app: tool table + add/edit/delete form
```

Each tool records a **name, category, brand, model, quantity, and location**.
Categories: Hand, Power, Clamps, Measuring, Sharpening, Safety, Fastening,
Finishing, Other.

## Prerequisites

- Ruby 3.4+ and Bundler
- Node 20+ and npm
- Angular CLI (`npm install -g @angular/cli`)

## Running

Start the backend (port 3000):

```bash
cd backend
bundle install
bin/rails db:prepare    # creates and migrates the SQLite database
bin/rails server
```

In a second terminal, start the frontend (port 4200):

```bash
cd frontend
npm install
npm start          # alias for `ng serve`
```

Open http://localhost:4200 to manage your inventory. The list starts empty —
add your first tool from the form at the top.

## API

All endpoints live under `/api` and accept/return JSON. Tool payloads are
wrapped in a `tool` key, e.g. `{ "tool": { "name": "Table saw", ... } }`.

| Method | Path              | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/tools`      | List tools (ordered)     |
| GET    | `/api/tools/:id`  | Show one tool            |
| POST   | `/api/tools`      | Create a tool            |
| PATCH  | `/api/tools/:id`  | Update a tool            |
| DELETE | `/api/tools/:id`  | Delete a tool            |

`name` is required and `quantity` must be a non-negative integer; validation
errors come back as `{ "errors": [...] }` with a `422` status.

## How it fits together

- `backend/app/models/tool.rb` — `Tool` model, validations, and category list.
- `backend/app/controllers/tools_controller.rb` — REST CRUD actions.
- `backend/config/routes.rb` — maps `/api/tools` to the controller.
- `backend/config/initializers/cors.rb` allows requests from the Angular dev
  server (`http://localhost:4200`). Tighten `origins` before deploying.
- `frontend/src/app/tool.service.ts` — `HttpClient` wrapper for the API.
- `frontend/src/app/tools/` — the inventory component (table + form), rendered
  by `frontend/src/app/app.ts`.

A leftover `GET /api/hello` endpoint from the original scaffold still exists but
is no longer used by the frontend.
