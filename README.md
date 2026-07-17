# Rails + Angular "Hello World"

A minimal full-stack starter: a Rails API backend that serves a JSON greeting,
and an Angular frontend that fetches and displays it.

```
.
├── backend/    # Rails 8 API-only app (GET /api/hello)
└── frontend/   # Angular app that calls the API and renders the message
```

## Prerequisites

- Ruby 3.4+ and Bundler
- Node 20+ and npm
- Angular CLI (`npm install -g @angular/cli`)

## Running

Start the backend (port 3000):

```bash
cd backend
bundle install
bin/rails server
```

In a second terminal, start the frontend (port 4200):

```bash
cd frontend
npm install
npm start          # alias for `ng serve`
```

Open http://localhost:4200 — you should see **"Hello, world from Rails!"**,
fetched live from the Rails API.

## How it fits together

- `backend/app/controllers/hello_controller.rb` renders `{ "message": "..." }`.
- `backend/config/routes.rb` maps `GET /api/hello` to that controller.
- `backend/config/initializers/cors.rb` allows requests from the Angular dev
  server (`http://localhost:4200`). Tighten `origins` before deploying.
- `frontend/src/app/app.ts` calls the API with `HttpClient` and stores the
  result in a signal that the template renders.
