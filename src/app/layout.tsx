import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils";
import CookieBanner from "@/components/layout/cookie-banner";
import { AnalyticsProviderHead, AnalyticsProviderBody } from "@/components/layout/analytics-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://tovy.eu"),
  title: {
    template: "%s | Tovy",
    default: "Data Engineering for E-commerce Growth | Tovy",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "nl_NL",
    siteName: "Tovy",
    images: [
      {
        url: "/images/tovy-og-image.webp",
        width: 1200,
        height: 630,
        alt: "Tovy Data Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Engineering for E-commerce Growth | Tovy",
    images: ["/images/tovy-og-image.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <AnalyticsProviderHead />
      </head>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen")}>
        <AnalyticsProviderBody />
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}