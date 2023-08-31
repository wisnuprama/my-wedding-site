import "./globals.css";
import type { Metadata } from "next";
import { Baskervville } from "next/font/google";

const font = Baskervville({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nadia & Wisnu",
  description: "Wedding Invitation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
