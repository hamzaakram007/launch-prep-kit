import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://prep.neongulf.com";

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
    default: "Launch Prep Kit — Personalized console launch checklist | NeonGulf",
    template: "%s · NeonGulf Launch Prep Kit",
  },
  description:
    "Answer five quick questions and get a printable, personalized console launch checklist from NeonGulf. Free browser checklist + PDF print. Independent fan utility — no official game assets.",
  applicationName: "NeonGulf Launch Prep Kit",
  authors: [{ name: "NeonGulf" }],
  creator: "NeonGulf",
  publisher: "NeonGulf",
  keywords: [
    "NeonGulf",
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
    siteName: "NeonGulf Launch Prep Kit",
    title: "Launch Prep Kit — Personalized console launch checklist",
    description:
      "Five questions. One printable checklist tailored to your console, storage, audio, friends, and midnight plan. From NeonGulf.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Prep Kit — Personalized console launch checklist | NeonGulf",
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
