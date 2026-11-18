# Launch Prep Kit

Personalized **console launch checklist → printable PDF** web app.

Answer five questions (console, storage, headset, friends, midnight launch). Get a tailored checklist you can tick off in the browser and export via **Print / Save as PDF**.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Client-side rule engine (`src/lib/checklist.ts`)
- Browser `window.print()` for PDF export (MVP)
- One-time pay stub: disabled **Unlock PDF — $4.99** button (Stripe/Lemon later)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MVP scope

- Landing → 5-step wizard → personalized checklist UI
- Print / Save as PDF (browser dialog)
- Paywall stub (disabled)
- Independent branding — no Rockstar / official game IP

## Legal

Independent fan utility by Hamza Akram. Not affiliated with Rockstar Games, Take-Two Interactive, Sony Interactive Entertainment, or Microsoft. No official logos, characters, maps, or assets.

## Deploy

Push to GitHub and import on [Vercel](https://vercel.com).
