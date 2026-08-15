import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.brand.url),
  title: {
    default: "BAVEXA | AI Lead Conversion System for Roofing Companies",
    template: "%s | BAVEXA",
  },
  description: "BAVEXA helps roofing companies respond to leads, qualify opportunities, automate follow-up, and move more prospects toward booked roof inspections.",
  keywords: ["roofing lead follow-up", "roofing lead qualification", "roof inspection booking", "AI for roofing companies", "missed-call text back"],
  authors: [{ name: "BAVEXA", url: siteConfig.brand.url }],
  creator: "BAVEXA",
  publisher: "BAVEXA",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.brand.url,
    siteName: "BAVEXA",
    title: "BAVEXA | AI Lead Conversion System for Roofing Companies",
    description: "Respond faster, qualify opportunities, automate follow-up, and move more roofing prospects toward booked inspections.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BAVEXA AI Lead Conversion System for Roofing Companies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAVEXA | AI Lead Conversion System for Roofing Companies",
    description: "A faster path from new roofing lead to qualified inspection opportunity.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/bavexa-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/bavexa-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/assets/favicon-32.png",
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  themeColor: "#0d1117",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <div id="main-content">{children}</div>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.brand.name,
              url: siteConfig.brand.url,
              description: siteConfig.brand.positioning,
              founder: {
                "@type": "Person",
                name: siteConfig.founder.name,
                url: siteConfig.founder.website,
                jobTitle: `${siteConfig.founder.role} · ${siteConfig.founder.positioning}`,
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
