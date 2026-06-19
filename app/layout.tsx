import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import GlobalProviders from "./components/global_providers";
import DeferredScripts from "./components/deferred_scripts";
import WebVitalsReporter from "./components/web_vitals_reporter";
import { getLcpPreloadUrls } from "@/app/lib/assets";
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
      "CigarroElectrico | Vapes Sri Lanka, Vape Accessories & E-Liquid",
    template: "%s",
  },
  description:
    "Shop vapes in Sri Lanka from CigarroElectrico. Browse premium disposable vapes, vape accessories, e-liquids, pod systems, and apparel with island-wide delivery.",
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
    title: "CigarroElectrico | Vapes Sri Lanka",
    description:
      "Explore CigarroElectrico for premium vapes, disposable vapes, vape accessories, e-liquids, and curated apparel in Sri Lanka.",
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
    title: "CigarroElectrico | Vapes Sri Lanka",
    description:
      "Discover premium vapes, disposable vapes, accessories, e-liquids, and curated apparel from CigarroElectrico in Sri Lanka.",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lcpPreloads = getLcpPreloadUrls();

  return (
    <html lang='en' suppressHydrationWarning data-scroll-behavior='smooth'>
      <head>
        {/* ── Preconnect to all external origins ─────────────────────────── */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.cigarroelectrico.com" />

        {/* ── Preload LCP hero background (responsive media queries) ────────── */}
        <link
          rel="preload"
          as="image"
          href={lcpPreloads.backgroundPatternMobile}
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={lcpPreloads.backgroundPatternDesktop}
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        {/* ── Preload the brand wordmark (above the fold, blocks FCP) ──────── */}
        <link
          rel="preload"
          as="image"
          href={lcpPreloads.brandWordmark}
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} antialiased`}
        suppressHydrationWarning
      >
        <WebVitalsReporter />
        <GlobalProviders>{children}</GlobalProviders>
        <DeferredScripts />
      </body>
    </html>
  );
}
