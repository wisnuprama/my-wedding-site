import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Wedding of Nadia & Wisnu",
    short_name: "NW",
    description:
      "Celebrate the joy of Nadia and Wisnu's wedding day on Saturday, June 15, 2024, at SOHO Pancoran Building in Jakarta, Indonesia. Your warm wishes and presence will make this wedding day a truly enchanting. We look forward to sharing this special moment with you!",
    start_url: "/",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#FACCCC",
    background_color: "#FACCCC",
    display: "standalone",
  };
}
