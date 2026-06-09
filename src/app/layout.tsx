import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import en from '@/dictionaries/en.json';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tovy.eu"),
  alternates: {
    canonical: '/',
  },
  title: en.redirects.title,
  description: en.redirects.description,
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
