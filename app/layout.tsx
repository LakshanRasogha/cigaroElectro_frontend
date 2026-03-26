import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // This tells Next.js the root URL for all your images and links
  metadataBase: new URL("https://cigarroelectrico.com"),

  title: "CigarroElectrico",
  description:
    "Shop premium vapes, exclusive accessories, and custom DFT graphic tees. Discover the CigarroElectrico lifestyle—your ultimate hub for culture and quality.",

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
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
