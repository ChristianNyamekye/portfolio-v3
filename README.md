# christiannyamekye.com — v3

Personal portfolio for Christian Nyamekye. Built to be fast, clean, and easy to maintain.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion  
**Deploy:** GitHub Pages via GitHub Actions (static export)

---

## Quick start

```bash
# Install
npm install

# Dev server
npm run dev

# Production build + export
npm run build
```

The build outputs to `/out` — that's what gets deployed to GitHub Pages.

---

## Updating content

**All content lives in one file: `lib/data.ts`**

- `meta` — name, email, social links, SEO
- `hero` — headline, subline, CTAs
- `about` — paragraphs and tag pills
- `experience` — work history
- `featuredProjects` — Tier 1 featured cards (EgoDex, GARB, EchecsAI, Spot)
- `notableProjects` — Tier 2 medium cards (Biblio, AM/FM Radio, Duck Car, etc.)
- `otherProjects` — Tier 3 compact grid (shows 4, expands to all)

Edit `data.ts`, push to `main`, GitHub Actions deploys automatically.

---

## Deploy to GitHub Pages

### First-time setup

1. Create a repo on GitHub (e.g. `portfolio-v3` or `christiannyamekye.com`)
2. Push this code to `main`
3. Go to **Settings → Pages → Source** → set to **GitHub Actions**
4. The first push will trigger the workflow

### Custom domain

1. Add a `CNAME` file to `/public/` with your domain:
   ```
   christiannyamekye.com
   ```
2. Set `NEXT_PUBLIC_BASE_PATH=''` in the workflow (already set)
3. Configure DNS: CNAME → `christiannyamekye.github.io`

---

## Adding a headshot

Replace the placeholder in `components/About.tsx` with an `<Image>` component:

```tsx
import Image from 'next/image'

// Replace the placeholder div with:
<Image
  src="/headshot.jpg"
  alt="Christian Nyamekye"
  width={400}
  height={500}
  className="object-cover w-full h-full"
  priority
/>
```

Drop `headshot.jpg` in `/public/`.

---

## Chatbot integration

The `<div id="chatbot-root">` in the layout is ready for mounting a widget. To add:

```tsx
// app/layout.tsx — add after the chatbot-root div
<script src="your-chatbot-bundle.js" defer />
```

Or mount a React component into `#chatbot-root` from a separate script.

---

## Project structure

```
portfolio-v3/
├── app/
│   ├── layout.tsx       # Root layout + metadata
│   ├── page.tsx         # Section assembly
│   └── globals.css      # Base styles, animations, utilities
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx     # Featured + Notable
│   ├── OtherProjects.tsx # Compact grid + Show More
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/
│   └── data.ts          # ← Edit this to update content
├── public/
│   └── (headshot, favicon, og.png go here)
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions auto-deploy
├── next.config.js       # Static export config
├── tailwind.config.ts
└── package.json
```
