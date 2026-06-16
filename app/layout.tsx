import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import GlobalProviders from "./components/global_providers";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default:
      "CigarroElectrico | Premium Vapes, Vape Accessories & Apparel in Sri Lanka",
    template: "%s | CigarroElectrico",
  },
  description:
    "Shop premium vapes, vape accessories, e-liquids, and lifestyle apparel at CigarroElectrico. Discover Cigarro Electrico online with curated hardware and culture-led essentials in Sri Lanka.",
  keywords: [...brandKeywords],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "CigarroElectrico | Premium Vapes, Accessories & Apparel",
    description:
      "Explore CigarroElectrico for premium vapes, vape accessories, e-liquids, and curated apparel.",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOgImage),
        width: 1200,
        height: 630,
        alt: "CigarroElectrico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CigarroElectrico | Premium Vapes, Accessories & Apparel",
    description:
      "Discover premium vapes, vape accessories, e-liquids, and curated apparel from CigarroElectrico.",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning data-scroll-behavior='smooth'>
      <head>
        {/* ── Preconnect to all external origins ─────────────────────────── */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.cigarroelectrico.com" />

        {/* ── Preload LCP hero background — browser discovers this instantly ─ */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/diznx0cr9/image/upload/f_auto,q_auto:eco,w_800/ptern_lbbsh7"
          fetchPriority="high"
        />
        {/* ── Preload the brand wordmark (above the fold, blocks FCP) ──────── */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/diznx0cr9/image/upload/f_auto,q_auto:good,w_300/logo_2_gld_qqqzjq"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} antialiased`}
        suppressHydrationWarning
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
