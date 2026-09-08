# Portfolio Website Walkthrough & Update Guide

## 📋 Project Overview

A full-stack portfolio: a Next.js frontend and an Express + MongoDB backend
with a working `/admin` dashboard. All content — profile info, skills,
work experience, education, certifications, and projects — lives in
MongoDB and is edited through the admin UI, not by hand-editing code.

---

## 🛠️ Technology Stack

### Frontend (`/`, deployed on Vercel)
- **Framework**: Next.js 16.1.1 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Motion, Tailwind Animate
- **Icons**: FontAwesome + Lucide React
- **Analytics**: `@vercel/analytics`
- **Content**: Content Collections (MDX) for blog posts only

### Backend (`/backend`, deployed on Render)
- **Framework**: Express
- **Database**: MongoDB (Mongoose), hosted on MongoDB Atlas
- **Auth**: JWT-signed admin sessions
- **Email**: Nodemailer (contact form)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage — fetches all content from the API
│   ├── admin/page.tsx           # Admin dashboard (login + editors)
│   ├── layout.tsx               # Root layout — fetches profile for SEO/JSON-LD
│   ├── globals.css              # Theme (CSS variables)
│   ├── robots.ts / sitemap.ts   # SEO
│   ├── opengraph-image.tsx      # OG image generator
│   └── blog/                    # Blog pages (still MDX-based, unrelated to the API)
│
├── components/
│   ├── admin/                   # Admin dashboard pieces
│   │   ├── login-form.tsx
│   │   ├── profile-editor.tsx
│   │   ├── collection-editor.tsx  # Generic list+form CRUD, used for skills/experience/education/certifications/projects
│   │   ├── record-form.tsx        # Field-driven form (text/textarea/boolean/select/array/links)
│   │   └── visitor-stats.tsx
│   ├── ui/, magicui/, section/, mdx/   # As before
│   ├── navbar.tsx                # Now takes `socials` as a prop
│   └── project-card.tsx
│
├── lib/
│   ├── api.ts                   # Typed client for the backend — getPortfolioData(), admin CRUD helpers, FALLBACK_DATA
│   ├── icon-map.tsx              # Maps the string icon keys stored in MongoDB to actual icon components
│   └── utils.ts, pagination.ts, remark-code-meta.ts
│
└── mdx-components.tsx

backend/
├── src/
│   ├── index.js                 # Express app entry
│   ├── db.js                    # Mongoose connection
│   ├── models/                  # Profile, Skill, Experience, Education, Certification, Project, Visit, Counter
│   ├── routes/                  # auth, portfolio (public aggregate), profile, visitors, contact, crud.js (generic factory)
│   └── middleware/auth.js       # JWT verification
├── scripts/
│   ├── seed.js                  # One-time DB population
│   └── smoke-test.js            # End-to-end test against an in-memory MongoDB
└── README.md                    # Render + Atlas deployment steps

content/
└── *.mdx                        # Blog posts — still authored by adding files, unrelated to the database
```

---

## ✏️ How to update content

Everything content-related is edited at **`/admin`** on the running site
(local: `http://localhost:3000/admin`), logged in with the backend's
`ADMIN_PASSWORD`:

- **Profile tab** — name, initials, site URL, resume URL, avatar URL, email, phone, description, hero tagline, about summary, and social links (add/remove/reorder, toggle which show in the navbar dock).
- **Skills / Experience / Education / Certifications / Projects tabs** — add, edit, or delete entries. Projects support technologies (comma-separated), multiple links (website/source, each with an icon), and an `active` toggle to show/hide on the homepage without deleting.

Changes save to MongoDB immediately and appear on the public site within
about a minute (the homepage revalidates every 60s).

To seed or reset all of the above from code instead of the UI, edit
[`backend/scripts/seed.js`](backend/scripts/seed.js) and run `npm run seed`
in `backend/`.

**Blog posts** are the one thing still file-based: add a new `.mdx` file to
[`content/`](content/) with frontmatter (`title`, `publishedAt`, `summary`,
`tags`) and push — content-collections picks it up at build time.

**Avatar / résumé PDF / logos**: these are static files served from
`public/` (e.g. `public/srikanta-panigrahy.png`), referenced by URL from
the Profile/Experience/Education fields in the admin. Replace the file in
`public/` and keep the same filename, or upload a new file and update the
URL field in `/admin` to match.

---

## 🎨 Customization

**Theme colors**: `src/app/globals.css` — CSS variables under `:root` and `.dark`.

**Icon choices**: skills and social/project links store a plain string key
(e.g. `"react"`, `"github"`) rather than a component, resolved by
[`src/lib/icon-map.tsx`](src/lib/icon-map.tsx). To offer a new icon in the
admin dropdowns, add it to `skillIconMap` (FontAwesome) or
`linkIconMap`/`SOCIAL_ICON_OPTIONS` (from `src/components/icons.tsx`) — the
`/admin` forms read their `<select>` options from these files.

---

## 🔧 Development Workflow

**Backend** (`backend/`): `npm install`, `cp .env.example .env` and fill in
`MONGODB_URI`/`JWT_SECRET`/`ADMIN_PASSWORD`, `npm run seed` once, `npm run dev`.

**Frontend** (repo root): `npm install`, `cp .env.example .env.local` and
set `NEXT_PUBLIC_API_URL=http://localhost:4000`, `npm run dev`.

```bash
npm run build   # frontend production build
npm run lint     # frontend lint
```

Backend has its own test: `cd backend && npm run smoke-test` spins up an
in-memory MongoDB and exercises every route.

---

## 🚀 Deployment

Two services, deployed separately:

- **Backend → Render**, with MongoDB Atlas as the database. Full steps in [`backend/README.md`](backend/README.md).
- **Frontend → Vercel**, pointed at the Render backend via `NEXT_PUBLIC_API_URL`. Full steps in the [README](README.md#deploying).

If the backend's `FRONTEND_URL` env var doesn't list your Vercel URL,
requests from the browser will fail CORS — update it on Render and redeploy.

Render's free tier spins down when idle; the frontend falls back to
built-in static content if the API is slow to wake up, so the site never
goes fully blank, but recent admin edits won't show until the backend
responds.

---

## 📚 Component Documentation

| Component | Purpose | File |
|-----------|---------|------|
| `BlurFade` | Fade-in scroll animation | `src/components/magicui/blur-fade.tsx` |
| `ProjectCard` | Project display card | `src/components/project-card.tsx` |
| `ProjectsSection` | Featured projects grid | `src/components/section/projects-section.tsx` |
| `WorkSection` | Work experience timeline | `src/components/section/work-section.tsx` |
| `ContactSection` | Contact form (posts to the backend) | `src/components/section/contact-section.tsx` |
| `CollectionEditor` | Generic admin list+form CRUD | `src/components/admin/collection-editor.tsx` |
| `ProfileEditor` | Admin form for the singleton Profile doc | `src/components/admin/profile-editor.tsx` |
| `VisitorStats` | Admin visitor count + recent visits table | `src/components/admin/visitor-stats.tsx` |
