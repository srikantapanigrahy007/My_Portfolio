# Srikanta Panigrahy Portfolio

A polished portfolio website built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Local development

Install dependencies:

```bash
npm install
```

Copy the env file and fill in your real values (see [Environment variables](#environment-variables)):

```bash
cp .env.example .env.local
```

Run the dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
npm run start
```

## Deploying on Vercel

This project deploys to [Vercel](https://vercel.com) with zero config — it auto-detects Next.js and uses `npm run build`.

1. Push this repo to GitHub (already done: `srikantapanigrahy007/My_Portfolio`).
2. In Vercel, click **Add New → Project** and import the repo.
3. Under **Environment Variables**, add the keys from `.env.example` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO_EMAIL` — for the contact form; `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional).
4. Deploy. Vercel gives you a `*.vercel.app` URL automatically; attach a custom domain under **Settings → Domains** if you have one.
5. Update `url` in [`src/data/resume.tsx`](src/data/resume.tsx) to match your final production URL (used for SEO metadata, Open Graph images, and the sitemap) and redeploy.
6. In the Vercel project dashboard, open the **Analytics** tab and enable it — the [`@vercel/analytics`](https://vercel.com/docs/analytics) package is already wired into the app (`src/app/layout.tsx`), so pageviews start showing up immediately once enabled. No database, API keys, or extra setup needed.

There used to be a file-based admin dashboard and visitor logger here; both wrote directly to disk (`content/*.mdx`, a JSON log file), which doesn't work on Vercel's read-only serverless filesystem, so they've been removed in favor of Vercel Analytics above. Blog posts are authored by adding `.mdx` files to `content/` and pushing — content-collections picks them up at build time.

## Project structure

- `src/app` contains the app router pages and routes
- `src/components` contains reusable UI and section components
- `content` contains MDX blog posts
- `src/data/resume.tsx` contains the main portfolio content

## Environment variables

See [`.env.example`](.env.example) for the full list with descriptions.

## Notes

Update the portfolio content in `src/data/resume.tsx` and the blog posts in `content/` to customize the site.
