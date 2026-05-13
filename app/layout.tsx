import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalProviders from "./components/global_providers";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://cigarroelectrico.com"),
  title: "CigarroElectrico",
  description:
    "Shop premium vapes, exclusive accessories, and custom DFT graphic tees. Discover the CigarroElectrico lifestyle—your ultimate hub for culture and quality, Cigarro Electrico",
  openGraph: {
    title: "CigarroElectrico | Vapes & Culture",
    description:
      "More than just a vape shop. Explore our curated collection of top-tier vapes, accessories, and unique custom DFT apparel.",
    url: "https://cigarroelectrico.com",
    siteName: "CigarroElectrico",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CigarroElectrico | Vapes & Culture",
    description:
      "Elevate your lifestyle with premium vapes and custom DFT tees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
