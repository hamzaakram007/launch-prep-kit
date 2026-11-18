# Launch Prep Kit

Personalized **console launch checklist → printable PDF** web app.

**Live:** [https://launch-prep-kit.vercel.app](https://launch-prep-kit.vercel.app)

Answer five questions (console, storage, headset, friends, midnight launch). Get a tailored checklist you can tick off in the browser and export via **Print / Save as PDF**.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Client-side rule engine (`src/lib/checklist.ts`)
- Browser `window.print()` for PDF export
- Pay stub: disabled **Unlock PDF — $4.99** (Stripe/Lemon later)
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
- Clear free vs paid unlock stub UX
- Independent branding — no Rockstar / official game IP

## Legal

Independent fan utility by Hamza Akram. Not affiliated with Rockstar Games, Take-Two Interactive, Sony Interactive Entertainment, or Microsoft. No official logos, characters, maps, or assets.

## Deploy

Already on Vercel. Pushing `main` redeploys [launch-prep-kit.vercel.app](https://launch-prep-kit.vercel.app).
