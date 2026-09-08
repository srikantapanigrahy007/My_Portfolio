# Portfolio API

Express + MongoDB backend for Srikanta Panigrahy's portfolio. Serves the
public portfolio content, the contact form, visitor analytics, and the
admin dashboard's CRUD endpoints (projects, skills, experience, education,
certifications, profile).

## Local development

```bash
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD at minimum
npm run seed            # one-time: populate the database with starter content
npm run dev
```

The API listens on `http://localhost:4000` by default (`PORT` in `.env`).

## Testing

```bash
npm run smoke-test
```

Spins up an in-memory MongoDB and exercises every route (auth, all five
CRUD resources, visitor tracking, contact) end-to-end — no real database
or `.env` needed. Good to run after any route/model change.

## Deploying on Render

1. Push this repo to GitHub (the backend lives in `backend/`, alongside the Next.js frontend at the repo root).
2. In Render, click **New → Web Service** and connect the repo.
3. Set:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (see `.env.example`): `MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD` (or `ADMIN_PASSWORD_HASH`), `FRONTEND_URL` (your Vercel URL), `SMTP_*`, `CONTACT_TO_EMAIL`.
5. Deploy. Render gives you a URL like `https://your-service.onrender.com`.
6. Run the seed script once against production, either locally with `MONGODB_URI` pointed at Atlas (`npm run seed`), or via Render's shell.
7. On the frontend (Vercel), set `NEXT_PUBLIC_API_URL` to the Render URL and redeploy.

### MongoDB Atlas setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Database Access → add a user with a strong password.
3. Network Access → allow access from anywhere (`0.0.0.0/0`) — Render's IPs aren't static on the free plan.
4. Database → Connect → Drivers → copy the connection string into `MONGODB_URI`, replacing `<password>` and adding a database name (e.g. `/portfolio`) before the `?`.

### Notes

- Render's free instance spins down after inactivity; the first request after idle can take ~30-60s to wake it up. The frontend's `getPortfolioData()` falls back to static content if the API doesn't respond in time, so the site still renders — it just won't reflect the latest admin edits until the backend wakes up.
- `JWT_SECRET` must be a real secret in production — generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
