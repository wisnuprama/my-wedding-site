import { useServerI18n } from "@/core/i18n";
import "./globals.css";
import type { Metadata } from "next";
import { Baskervville } from "next/font/google";

const font = Baskervville({ weight: ["400"], subsets: ["latin"] });

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
  const i18n = useServerI18n()
  return (
    <html lang={i18n.getLocale()}>
      <body className={font.className}>{children}</body>
    </html>
  );
}
