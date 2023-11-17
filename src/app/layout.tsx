import { useServerI18n } from "@/core/i18n";
import "./globals.css";
import type { Metadata } from "next";
import { font } from "@/core/styles";
import { Analytics } from "@vercel/analytics/react";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 *
 * NOTE: disabled because of https://github.com/vercel/next.js/issues/48490
 */
// export const runtime = "edge";

export const metadata: Metadata = {
  title: "Nadia & Wisnu",
  description: "Wedding Invitation",
  robots: "noindex",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i18n = useServerI18n();
  return (
    <html lang={i18n.getLocale()}>
      <body className={font.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
