# Launch Prep Kit

Personalized **console launch checklist → printable PDF** — a [NeonGulf](https://neongulf.com) product.

**Live:** [https://prep.neongulf.com](https://prep.neongulf.com)

Answer ten questions (console, storage, TV/display, headset, capture, accessibility, household rules, spoilers, friends, launch-day plan). Get a tailored checklist you can tick off in the browser and export via **Download PDF checklist** (Print → Save as PDF).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Client-side rule engine (`src/lib/checklist.ts`) with answer validation
- Browser `window.print()` for PDF export + mobile print tips
- Security headers (`nosniff`, `DENY` frame, referrer, permissions)
- Pro PDF unlock waitlist ($4.99 one-time when checkout opens)
- SEO: Open Graph image, JSON-LD, `robots.ts`, `sitemap.ts`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Landing CTA → 10-step wizard (keyboard + auto-advance) → personalized checklist
- Progress persistence in `localStorage` (validated schema, v2)
- Print-optimized CSS (letter page, avoid orphan sections, print footer)
- Empty / error states for incomplete wizard, print failure, storage quota
- Soft NeonGulf footer (no affiliate product catalog)
- No Rockstar / official game IP in UI or PDF art

## Legal

Independent fan utility from NeonGulf. Not affiliated with Rockstar Games, Take-Two Interactive, Sony Interactive Entertainment, or Microsoft. No official logos, characters, maps, or assets.

## Deploy

On Vercel at [prep.neongulf.com](https://prep.neongulf.com). Pushing `main` redeploys.
