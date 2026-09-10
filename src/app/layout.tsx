import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import en from '@/dictionaries/en.json';
import "./globals.css";
import { cn } from "@/lib/utils";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tovy.eu"),
  alternates: {
    canonical: '/',
  },
  title: en.global.redirects.title,
  description: en.global.redirects.description,
  other: {
    'revisit-after': '14 days',
    'googlebot': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sora.variable, spaceGrotesk.variable, "scroll-smooth")} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
