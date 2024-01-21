import { getServerI18n } from "@/core/i18n";
import type { Metadata } from "next";

const metadata: Metadata = {
  metadataBase: new URL("https://nadiawisnu.wedding"),
  title: "The Wedding of Nadia & Wisnu",
  description:
    "Celebrate the joy of Nadia and Wisnu's wedding day on Saturday, June 15, 2024, at SOHO Pancoran Building in Jakarta, Indonesia. Your warm wishes and presence will make this wedding day a truly enchanting. We look forward to sharing this special moment with you!",
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

export function generateMetadata() {
  const description = getServerI18n().t("site_description");

  const m = { ...metadata };

  if (description) {
    m.description = description;
  }

  return m;
}
