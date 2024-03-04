import { useServerI18n } from "@/core/i18n";
import "./globals.css";
import { font } from "@/core/styles";
import Head from "next/head";

import { generateMetadata as _generateMetadata } from "./metadata";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 *
 * NOTE: disabled because of https://github.com/vercel/next.js/issues/48490
 */
// export const runtime = "edge";

// export const metadata: Metadata = _metadata;
export const generateMetadata = _generateMetadata;

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
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <meta name="twitter:image" content="<generated>" />
        <meta name="twitter:image:type" content="<generated>" />
        <meta name="twitter:image:width" content="<generated>" />
        <meta name="twitter:image:height" content="<generated>" />
      </Head>
      <body className={font.className}>
        {event}
        {children}
      </body>
    </html>
  );
}
