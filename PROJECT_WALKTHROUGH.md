# Portfolio Website Walkthrough & Update Guide

## 📋 Project Overview

This is a **modern portfolio website** built with Next.js showcasing your professional profile, projects, work experience, skills, and blog content. It's a production-ready full-stack application with multiple key sections.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Motion, Tailwind Animate
- **Icons**: FontAwesome + Lucide React

### Backend/Features
- **Email**: Nodemailer (contact form)
- **Syntax Highlighting**: Shiki + rehype-pretty-code
- **Markdown**: React Markdown + remark-gfm
- **Content**: Content Collections (MDX)
- **Theme**: Next Themes (dark/light mode)

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router Pages
│   ├── page.tsx                 # Homepage (Hero + All sections)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── robots.ts                # SEO robots file
│   ├── sitemap.ts               # SEO sitemap
│   ├── not-found.tsx            # 404 page
│   ├── opengraph-image.tsx      # OG image generator
│   ├── blog/                    # Blog pages
│   │   ├── page.tsx             # Blog listing
│   │   ├── [slug]/              # Individual blog posts
│   │   └── opengraph-image.tsx  # OG images for blogs
│   ├── api/                     # API Routes
│   │   ├── contact/route.ts     # Contact form endpoint
│   │   ├── visitor/route.ts     # Visitor tracking
│   │   └── admin/               # Admin dashboard API
│   │       ├── auth/route.ts
│   │       └── blogs/route.ts
│   ├── certifications/          # Certifications page
│   └── [adminPath]/             # Admin dashboard page
│
├── components/                   # Reusable Components
│   ├── ui/                      # Basic UI Components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── accordion.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   ├── tooltip.tsx
│   │   └── svgs/                # Technology icons
│   ├── magicui/                 # Animated components
│   │   ├── blur-fade.tsx        # Fade in animation
│   │   ├── blur-fade-text.tsx
│   │   ├── dock.tsx             # Dock menu
│   │   └── flickering-grid.tsx  # Background grid
│   ├── section/                 # Page Sections
│   │   ├── contact-section.tsx  # Contact form
│   │   ├── projects-section.tsx # Featured projects
│   │   └── work-section.tsx     # Work experience
│   ├── mdx/                     # MDX-specific components
│   │   ├── code-block.tsx       # Syntax highlighted code
│   │   └── media-container.tsx
│   ├── admin-dashboard.tsx      # Admin panel
│   ├── navbar.tsx               # Navigation bar
│   ├── icons.tsx                # Icon exports
│   ├── mode-toggle.tsx          # Theme toggle
│   ├── theme-provider.tsx       # Theme provider
│   ├── project-card.tsx         # Project card component
│   └── visitor-tracker.tsx      # Visitor analytics
│
├── data/
│   ├── resume.tsx               # 📝 MAIN DATA FILE - All portfolio content
│   └── visitors.json            # Visitor data
│
├── lib/
│   ├── utils.ts                 # Utility functions
│   ├── pagination.ts            # Pagination logic
│   └── remark-code-meta.ts      # Markdown plugin
│
└── mdx-components.tsx           # MDX custom components

content/
├── deploy-website-on-aws-ec2-step-by-step.mdx  # Blog posts
└── [Add more .mdx files here]

public/
├── fonts/                       # Custom fonts
└── [Your images/assets]
```

---

## 🎯 Key Sections to Update

### 1. **Personal Information** [`src/data/resume.tsx`](src/data/resume.tsx)
- **Name**: `DATA.name` - Your full name
- **Headline**: Update the hero description in `page.tsx`
- **Email**: `DATA.contact.email`
- **Phone**: `DATA.contact.tel`
- **Social Links**: `DATA.contact.social` (GitHub, LinkedIn, Twitter, etc.)
- **Avatar**: Replace image at `public/srikanta-panigrahy.png`

### 2. **Skills Section** [`src/data/resume.tsx`](src/data/resume.tsx) - Line ~35
```typescript
skills: [
  { name: "HTML5", icon: faHtml5 },
  { name: "React", icon: faReact },
  // Add/remove skills here
]
```

### 3. **Work Experience** [`src/data/resume.tsx`](src/data/resume.tsx) - Line ~77
```typescript
work: [
  {
    company: "CSRBOX",
    title: "AI Strategy & Business Intelligence Intern",
    description: "...",
    start: "Mar 2026",
    end: "Apr 2026",
    // Update these fields
  }
]
```

**Current Work Experience:**
- ✅ CSRBOX - AI Strategy & BI Intern (Mar 2026 - Apr 2026)
- ✅ Physics Wallah - Freelancer

### 4. **Featured Projects** [`src/data/resume.tsx`](src/data/resume.tsx) - Line ~130
```typescript
projects: [
  {
    title: "WorkSync",
    description: "SaaS team collaboration platform",
    technologies: ["React", "Node.js", "MongoDB", ...],
    href: "https://slackapp.online",
    active: true,  // Shows on homepage if true
    // Update these fields
  }
]
```

**Current Projects:**
1. **WorkSync** - SaaS collaboration platform (2025)
2. **Credo** - Personal finance app (2024)

### 5. **Blog Posts** [`content/`](content/)
- Add new blog posts as `.mdx` files in the `content/` directory
- Example: `content/my-first-blog-post.mdx`
- Blog auto-loads from MDX files with frontmatter

### 6. **Navigation** [`src/data/resume.tsx`](src/data/resume.tsx) - Line ~73
```typescript
navbar: [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/blog", icon: NotebookIcon, label: "Blog" },
  // Add more navigation items
]
```

---

## 🚀 Homepage Sections (in order)

1. **Hero Section** - Your name, headline, and CTA
2. **About** - Professional summary from `DATA.summary`
3. **Skills** - Displayed from `DATA.skills` array
4. **Work Experience** - Timeline from `DATA.work` array
5. **Featured Projects** - Cards from `DATA.projects` (filtered by `active: true`)
6. **Contact Section** - Contact form with validation

---

## 📝 How to Update Each Section

### Update Personal Info
**File**: [src/data/resume.tsx](src/data/resume.tsx)

```typescript
export const DATA = {
  name: "Your Name",                    // ← Update
  initials: "YN",                       // ← Update
  url: "https://yourwebsite.com",       // ← Update
  description: "Your description...",   // ← Update
  summary: "Your about section...",     // ← Update
  avatarUrl: "/your-avatar.webp",       // ← Update
  // ... rest of DATA
}
```

### Update Skills
**File**: [src/data/resume.tsx](src/data/resume.tsx) - ~Line 35

Add or remove items from the `skills` array. Available icons:
- FontAwesome: `faReact`, `faNodeJs`, `faPython`, `faJava`, etc.
- Lucide: Import from "lucide-react"
- Custom: Add SVG in `src/components/ui/svgs/`

### Update Work Experience
**File**: [src/data/resume.tsx](src/data/resume.tsx) - ~Line 77

```typescript
work: [
  {
    company: "Company Name",
    href: "https://company.com",        // Optional link
    title: "Your Job Title",
    location: "City, Country",
    logoUrl: "/company-logo.png",       // Add to public/
    start: "Jan 2025",
    end: "Present",
    description: "Your responsibilities...",
    badges: ["Badge1", "Badge2"],       // Optional
  },
  // Add more jobs
]
```

### Update Projects
**File**: [src/data/resume.tsx](src/data/resume.tsx) - ~Line 130

```typescript
projects: [
  {
    title: "Project Name",
    description: "What it does...",
    href: "https://project-url.com",
    dates: "2025",
    active: true,                       // Show on homepage
    technologies: ["React", "Node.js"], // Tech stack
    image: "https://image-url.jpg",    // Optional
    video: "https://video-url.mp4",    // Optional
    links: [
      {
        type: "Website",
        href: "https://...",
        icon: <Icons.globe className="size-3" />,
      },
      {
        type: "Source",
        href: "https://github.com/...",
        icon: <Icons.github className="size-3" />,
      },
    ],
  },
  // Add more projects
]
```

### Add Blog Posts
**File**: Create new file in [`content/`](content/)

Example: `content/my-blog-post.mdx`
```markdown
---
title: "My Blog Post Title"
summary: "Brief description for listings"
date: "2025-01-15"
tags: ["react", "nextjs"]
---

# Blog post content goes here

You can use **markdown** and MDX components.

```typescript
// code blocks with syntax highlighting
const hello = "world";
```
```

---

## 🎨 Customization Tips

### Change Theme Colors
**File**: `src/app/globals.css`
- Modify CSS variables for primary, secondary colors
- Tailwind handles the theme

### Add Social Links
**File**: [src/data/resume.tsx](src/data/resume.tsx) - ~Line 58
```typescript
contact: {
  social: {
    GitHub: { ... },
    LinkedIn: { ... },
    X: { ... },
    // Add more here
    YouTube: {
      name: "YouTube",
      url: "https://youtube.com/...",
      icon: Icons.youtube,  // Add to icons.tsx
      navbar: true,
    }
  }
}
```

### Update Navigation
**File**: [src/data/resume.tsx](src/data/resume.tsx) - ~Line 73
```typescript
navbar: [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/blog", icon: NotebookIcon, label: "Blog" },
  { href: "/projects", icon: ProjectIcon, label: "Projects" }, // Add this
]
```

---

## 🔧 Development Workflow

### Start Development Server
```bash
pnpm dev
# or
npm run dev
```
Visit http://localhost:3000

### Build for Production
```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

### Lint Code
```bash
pnpm lint
pnpm lint:fix
```

---

## 📊 Visitor Analytics
**File**: [src/data/visitors.json](src/data/visitors.json)

Tracks visitor data using the visitor-tracker component. API endpoint at `src/app/api/visitor/route.ts`

---

## ✉️ Contact Form
**File**: `src/app/api/contact/route.ts`

Uses Nodemailer to send emails. Configure:
- Email service settings
- Recipient email address
- Email template

**UI Component**: [src/components/section/contact-section.tsx](src/components/section/contact-section.tsx)

---

## 🎯 Priority Update Checklist

- [ ] Update `DATA.name` and personal info in [resume.tsx](src/data/resume.tsx)
- [ ] Update profile image in `public/srikanta-panigrahy.png`
- [ ] Update skills list
- [ ] Add/update work experience entries
- [ ] Add/update featured projects
- [ ] Update social media links
- [ ] Update hero description and summary
- [ ] Add blog posts in `content/` folder
- [ ] Configure contact form email settings
- [ ] Test all links and external URLs
- [ ] Build and test for production

---

## 🚀 Deployment Tips

The site is ready to deploy on:
- **Vercel** (Recommended - optimized for Next.js)
- **Netlify**
- **AWS**, **Azure**, **Google Cloud**

Update the `url` field in [resume.tsx](src/data/resume.tsx) to your production domain.

---

## 📚 Component Documentation

| Component | Purpose | File |
|-----------|---------|------|
| `BlurFade` | Fade-in scroll animation | `src/components/magicui/blur-fade.tsx` |
| `ProjectCard` | Project display card | `src/components/project-card.tsx` |
| `ProjectsSection` | Featured projects grid | `src/components/section/projects-section.tsx` |
| `WorkSection` | Work experience timeline | `src/components/section/work-section.tsx` |
| `ContactSection` | Contact form | `src/components/section/contact-section.tsx` |

---

## 🆘 Quick Reference

| Task | File | Notes |
|------|------|-------|
| Add project | [resume.tsx](src/data/resume.tsx) L130 | Set `active: true` to show |
| Add work exp | [resume.tsx](src/data/resume.tsx) L77 | Displays in timeline |
| Add skill | [resume.tsx](src/data/resume.tsx) L35 | Pick icon from FontAwesome |
| Write blog post | `content/*.mdx` | Auto-discovered |
| Change colors | `src/app/globals.css` | CSS variables |
| Update about | [resume.tsx](src/data/resume.tsx) L19 | `DATA.summary` field |

---

**Start updating your portfolio now! Edit [src/data/resume.tsx](src/data/resume.tsx) first - it contains most of your content.**
