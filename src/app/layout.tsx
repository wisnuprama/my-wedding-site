import { useServerI18n } from "@/core/i18n";
import "./globals.css";
import type { Metadata } from "next";
import { Hurricane, Jomolhari } from "next/font/google";

const font = Jomolhari({ weight: ["400"], subsets: ["latin"] });
export const fontCursive = Hurricane({ weight: ["400"], subsets: ["latin"] });

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
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
      <body className={font.className}>{children}</body>
    </html>
  );
}
