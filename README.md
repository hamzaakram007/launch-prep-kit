# Launch Prep Kit

Personalized **console launch checklist → printable PDF** — a [NeonGulf](https://neongulf.com) product.

**Live:** [https://prep.neongulf.com](https://prep.neongulf.com)

Answer five questions (console, storage, headset, friends, midnight launch). Get a tailored checklist you can tick off in the browser and export via **Print / Save as PDF**.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Client-side rule engine (`src/lib/checklist.ts`)
- Browser `window.print()` for PDF export
- Pro PDF unlock waitlist ($4.99 one-time when checkout opens)
- SEO: Open Graph image, JSON-LD, `robots.ts`, `sitemap.ts`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Landing → 5-step wizard (keyboard + auto-advance) → personalized checklist
- Progress persistence in `localStorage`
- Print-optimized CSS (letter page, avoid orphan items, print footer)
- Free Print / Save as PDF now; Pro checkout opens soon (waitlist)
- NeonGulf branding — no Rockstar / official game IP

## Legal

Independent fan utility from NeonGulf. Not affiliated with Rockstar Games, Take-Two Interactive, Sony Interactive Entertainment, or Microsoft. No official logos, characters, maps, or assets.

## Deploy

On Vercel at [prep.neongulf.com](https://prep.neongulf.com). Pushing `main` redeploys.
