# Store Ratings App

Full-stack app where users can register, log in, and rate stores (1–5 stars), with role-based access for Admin, Normal User, and Store Owner.

- Backend: `Express.js` + `Prisma` + `PostgreSQL`
- Frontend: `React` (Vite)

## Features
- Auth: Signup/Login with JWT, roles: `ADMIN`, `USER`, `OWNER`
- Admin: manage users and stores, view stats
- User: view/search stores, submit/update ratings
- Owner: view their stores, see users who rated and average ratings

## Getting Started

### 1) Prerequisites
- Node.js 18+
- PostgreSQL running locally

Create a local database, e.g. `store_ratings`.

```sql
CREATE DATABASE store_ratings;
```

### 2) Backend setup

Copy env template and edit values as needed.

```bash
cp server/.env.example server/.env
# Edit server/.env to point to your Postgres connection and set JWT_SECRET
```

Install dependencies and generate Prisma client.

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Backend runs by default at http://localhost:4000

Health check:

```bash
curl http://localhost:4000/health
```

### 3) Frontend setup

Copy env template (optional: defaults to localhost backend).

```bash
cp client/.env.example client/.env
```

Install dependencies and start dev server.

```bash
cd client
npm install
npm run dev
```

Frontend runs by default at http://localhost:5173

### 4) Login/Signup
- Use the Signup page to create a `USER` or `OWNER`.
- To create an `ADMIN` or pre-create stores, log in as any `ADMIN` (create one via `POST /api/admin/users` once you have an admin token, or temporarily allow `role` during signup in `.env` controlled environments.)

### API Overview
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/stores?search=...`
- `GET /api/stores/:id`
- `POST /api/ratings` (USER)
- `GET /api/owner/my-stores` (OWNER)
- `GET /api/owner/my-stores/:id/ratings` (OWNER)
- `GET /api/admin/users` (ADMIN)
- `POST /api/admin/users` (ADMIN)
- `GET /api/admin/stores` (ADMIN)
- `POST /api/admin/stores` (ADMIN)
- `GET /api/admin/stats` (ADMIN)

### Notes
- Passwords are hashed with bcrypt.
- Ratings are upserted per `(userId, storeId)` unique constraint.
- Average ratings are computed on the fly.
