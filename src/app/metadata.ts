import type { Metadata } from "next";
import config from "@/core/config";

const metadata: Metadata = {
  metadataBase: new URL("https://nadiawisnu.wedding"),
  title: "The Wedding of Nadia & Wisnu",
  description: `Join us for the wedding of Nadia and Wisnu on Saturday, 15 June 2024, at SOHO Pancoran Building in Jakarta, Indonesia.`,
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

export default metadata;
