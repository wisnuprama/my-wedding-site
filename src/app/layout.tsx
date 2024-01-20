import { useServerI18n } from "@/core/i18n";
import "./globals.css";
import type { Metadata } from "next";
import { font } from "@/core/styles";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 *
 * NOTE: disabled because of https://github.com/vercel/next.js/issues/48490
 */
// export const runtime = "edge";

export const metadata: Metadata = {
  title: "Nadia & Wisnu Wedding",
  description: "Wedding Invitation",
  robots: "noindex",
  authors: [
    {
      name: "Wisnu Pramadhitya Ramadhan",
    },
    {
      name: "Nadia Rizqi Aziza",
    },
  ],
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

type RootLayoutProps = {
  event: React.ReactNode;
  children: React.ReactNode;
};

export default function RootLayout({ event, children }: RootLayoutProps) {
  const i18n = useServerI18n();
  return (
    <html lang={i18n.getLocale()}>
      <Head>
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <script src="https://www.google.com/recaptcha/api.js" async defer />
      </Head>
      <body className={font.className}>
        {event}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
