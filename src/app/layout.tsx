import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const SITE_URL = "https://prep.neongulf.com";

const syne = localFont({
  src: [
    { path: "./fonts/Syne-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Syne-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Syne-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Syne-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = localFont({
  src: [
    { path: "./fonts/DMSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DMSans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/DMSans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/DMSans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Launch Prep Kit — Get your console checklist PDF | NeonGulf",
    template: "%s · NeonGulf Launch Prep Kit",
  },
  description:
    "Answer ten quick questions and download a personalized console launch checklist PDF from NeonGulf. Covers storage, TV/display, headset, household rules, and launch-day plan. Free — no signup.",
  applicationName: "NeonGulf Launch Prep Kit",
  authors: [{ name: "NeonGulf" }],
  creator: "NeonGulf",
  publisher: "NeonGulf",
  keywords: [
    "NeonGulf",
    "console launch checklist PDF",
    "PS5 launch prep checklist",
    "Xbox Series launch prep",
    "printable gaming checklist",
    "midnight launch checklist",
    "console night prep PDF",
    "TV headset storage checklist",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "NeonGulf Launch Prep Kit",
    title: "Get your console launch checklist PDF",
    description:
      "Ten questions → one printable checklist for storage, display, headset, house rules, and launch day. Free from NeonGulf.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get your console launch checklist PDF | NeonGulf",
    description:
      "Ten questions. One personalized printable checklist. Free — no signup.",
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
  name: "NeonGulf Launch Prep Kit",
  url: SITE_URL,
  description:
    "Personalized console launch checklist generator with printable PDF export, from NeonGulf.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free interactive checklist with browser print / Save as PDF",
  },
  author: {
    "@type": "Organization",
    name: "NeonGulf",
    url: "https://neongulf.com",
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
