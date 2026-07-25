# Contact Book App

A full-stack contact management app with a React frontend and a Node.js/Express REST API backed by SQLite.

## Features

- Create, view, edit, delete, and search contacts (name, email, phone, company, notes)
- RESTful JSON API
- Data persisted locally in a SQLite database file (no external services required)

## Tech stack

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`)

## Project structure

```
contact-book-app/
├── backend/          # Express REST API + SQLite database
│   └── src/
│       ├── server.js          # App entry point
│       ├── db.js              # SQLite connection + schema
│       └── contactsRouter.js  # /api/contacts routes
└── frontend/         # React (Vite) UI
    └── src/
        ├── App.jsx            # Main layout + state
        ├── ContactForm.jsx    # Add/edit form
        ├── ContactList.jsx    # Contact cards list
        └── api.js             # Fetch wrapper for the backend API
```

## Prerequisites

- Node.js 18+ and npm

## Setup

Install dependencies for both apps:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Running locally

Start the backend (defaults to `http://localhost:4000`):

```bash
cd backend
npm start
```

In a separate terminal, start the frontend (defaults to `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite dev server proxies `/api` requests to the backend, so no extra configuration is needed.

The SQLite database file (`backend/contacts.db`) is created automatically on first run.

## API

Base URL: `/api/contacts`

| Method | Path            | Description                     |
| ------ | --------------- | -------------------------------- |
| GET    | `/api/contacts`     | List all contacts (supports `?q=` search) |
| GET    | `/api/contacts/:id` | Get a single contact             |
| POST   | `/api/contacts`     | Create a contact                 |
| PUT    | `/api/contacts/:id` | Update a contact                 |
| DELETE | `/api/contacts/:id` | Delete a contact                 |

Contact fields: `name` (required), `email`, `phone`, `company`, `notes`.

## Building for production

```bash
cd frontend
npm run build
```

This outputs static assets to `frontend/dist`, which can be served by any static host. Point it at a deployed instance of the backend (update the API base URL / proxy as needed for your hosting setup).
