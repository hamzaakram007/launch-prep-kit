import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://launch-prep-kit.vercel.app";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Launch Prep Kit — Personalized console launch checklist",
    template: "%s · Launch Prep Kit",
  },
  description:
    "Answer five quick questions and get a printable, personalized console launch checklist. Free browser checklist + PDF print. Independent fan utility — no official game assets.",
  applicationName: "Launch Prep Kit",
  authors: [{ name: "Hamza Akram" }],
  creator: "Hamza Akram",
  keywords: [
    "console launch checklist",
    "PS5 launch prep",
    "Xbox Series launch prep",
    "printable gaming checklist",
    "midnight launch checklist",
    "console night prep",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Launch Prep Kit",
    title: "Launch Prep Kit — Personalized console launch checklist",
    description:
      "Five questions. One printable checklist tailored to your console, storage, audio, friends, and midnight plan.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Prep Kit — Personalized console launch checklist",
    description:
      "Five questions. One printable checklist tailored to your console night.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#040b12" },
    { media: "(prefers-color-scheme: light)", color: "#040b12" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Launch Prep Kit",
  url: SITE_URL,
  description:
    "Personalized console launch checklist generator with printable PDF export.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free interactive checklist with browser print / Save as PDF",
  },
  author: {
    "@type": "Person",
    name: "Hamza Akram",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
