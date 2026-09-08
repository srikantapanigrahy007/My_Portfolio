# Srikanta Panigrahy Portfolio

A full-stack portfolio site: a Next.js frontend (deployed on Vercel) backed
by an Express + MongoDB API (deployed on Render) with a working admin
dashboard for managing content and viewing visitor stats.

```
srikantapanigrahy-main/
├── src/            Next.js frontend (App Router)
├── content/         MDX blog posts
├── backend/         Express + MongoDB API — see backend/README.md
```

## Local development

Run both halves side by side.

**Backend** (in `backend/`):

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD
npm run seed             # one-time: populate starter content
npm run dev               # http://localhost:4000
```

**Frontend** (repo root):

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                    # http://localhost:3000
```

Visit `/admin` on the frontend to log in (password = your backend's
`ADMIN_PASSWORD`) and manage profile info, skills, experience, education,
certifications, and projects — changes go straight to MongoDB and appear
on the site within a minute (ISR revalidates every 60s).

Create a production build of the frontend with `npm run build && npm run start`.

## Deploying

### Backend → Render

See [`backend/README.md`](backend/README.md) for full steps: create a
MongoDB Atlas cluster, deploy `backend/` as a Render Web Service, set its
env vars, and run the seed script once.

### Frontend → Vercel

This project deploys to [Vercel](https://vercel.com) with zero config —
it auto-detects Next.js and uses `npm run build`.

1. Push this repo to GitHub (already done: `srikantapanigrahy007/My_Portfolio`).
2. In Vercel, click **Add New → Project** and import the repo (root directory stays at the repo root, not `backend/`).
3. Under **Environment Variables**, set `NEXT_PUBLIC_API_URL` to your Render backend's URL (e.g. `https://your-service.onrender.com`). `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional.
4. Deploy. Vercel gives you a `*.vercel.app` URL automatically; attach a custom domain under **Settings → Domains** if you have one.
5. Update the `url` field via `/admin` → Profile (or directly in MongoDB) to match your final production URL, used for SEO metadata, Open Graph images, and the sitemap.
6. In the Vercel project dashboard, open the **Analytics** tab and enable it — [`@vercel/analytics`](https://vercel.com/docs/analytics) is already wired into `src/app/layout.tsx`, so pageviews start showing up immediately. This is separate from the custom visitor counter in `/admin`, which comes from the backend and works regardless of host.

If the backend's `FRONTEND_URL` env var doesn't include your Vercel URL, the browser will get CORS errors calling the API — update it on Render and redeploy.

## Project structure

- `src/app` — app router pages and routes (including `/admin`)
- `src/components` — reusable UI, section, and admin-dashboard components
- `src/lib/api.ts` — typed client for the backend API, with static fallback data if the backend is unreachable
- `content/` — MDX blog posts (unrelated to the backend; still authored by adding files and pushing)
- `backend/` — the Express + MongoDB API (see its own README)

## Environment variables

See [`.env.example`](.env.example) (frontend) and [`backend/.env.example`](backend/.env.example) (backend) for the full list with descriptions.
