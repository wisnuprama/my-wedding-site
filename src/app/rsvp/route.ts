import { RSVPTokenManager } from "@/modules/RSVP/RSVPTokenManager";
import { NextResponse } from "next/server";
// @ts-expect-error - no types
import cookie from "cookie";
import { generateMetadata } from "../metadata";
import { getHostname } from "@/common/nextjs/navigation";

/**
 * Some opengraph service can only accept limited chars and the RSVP token is too long.
 * So in some cases it won't display properly. We will use URL shortener /s/:slug for sharing.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const rsvpToken = url.searchParams.get("t");

  console.info("[rsvp.GET] Received RSVP request URL", request.url);

  if (!rsvpToken) {
    console.warn("[rsvp.GET] No RSVP token provided");
    return NextResponse.redirect(new URL("/", getHostname()));
  }

  const tokenManager = new RSVPTokenManager();

  const [isValidRSVP, tokenData] =
    await tokenManager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP) {
    console.warn("[rsvp.GET] Invalid RSVP token provided", { rsvpToken });
    return NextResponse.redirect(new URL("/", getHostname()));
  }

  console.info("[rsvp.GET] Valid token. Setting up RSVP cookies", {
    id: tokenData.id,
  });

  const redirectURL = new URL("/", getHostname());

  if (
    // no token from param
    !url.searchParams.has("c") ||
    // token from param & cookies are diff, so we need to keep setting the params
    url.searchParams.has("d")
  ) {
    redirectURL.searchParams.set("t", rsvpToken); // pass the token to the client as param
    redirectURL.searchParams.set("c", "1"); // means client must check whether the cookies exist before proceeding to set the cookies again
  }

  // NOTE: https://github.com/vercel/next.js/discussions/48434#discussioncomment-7843884
  // Issue: https://github.com/wisnuprama/my-wedding-site/issues/46
  // workaround solution
  const headers = new Headers();
  headers.set("Content-Type", "text/html");
  headers.append(
    "Set-Cookie",
    cookie.serialize("ws_r", rsvpToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",

      // 10 years
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
      maxAge: 60 * 60 * 24 * 365 * 10,
    }),
  );

  const metadata = generateMetadata();

  // NOTE
  // need to update the opengraph metadata manually
  const response = new Response(
    `<html>
    <head>
      <title>${metadata.title}</title>
      <meta name="description" content="${metadata.description}" />
      <meta name="robots" content="${metadata.robots}" />
      <meta property="og:title" content="The Wedding of Nadia &amp; Wisnu">
      <meta property="og:description"
        content="${metadata.description}">
      <meta property="og:image:type" content="image/jpeg">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt"
        content="Join us for the wedding of Nadia and Wisnu on Saturday, 15 June 2024, at SOHO Pancoran Building in Jakarta, Indonesia.">
      <meta property="og:image" content="https://nadiawisnu.wedding/opengraph-image.jpg?9ad113ebb9deb4e2">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="The Wedding of Nadia &amp; Wisnu">
      <meta name="twitter:description"
        content="${metadata.description}">
      <meta name="twitter:image:type" content="image/jpeg">
      <meta name="twitter:image:width" content="1200">
      <meta name="twitter:image:height" content="630">
      <meta name="twitter:image:alt"
        content="Join us for the wedding of Nadia and Wisnu on Saturday, 15 June 2024, at SOHO Pancoran Building in Jakarta, Indonesia.">
      <meta name="twitter:image" content="https://nadiawisnu.wedding/twitter-image.jpg?9ad113ebb9deb4e2">
      <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16">
    </head>
    <script>window.location.href = '${redirectURL.toString()}'</script>
    </html>`,
    {
      status: 200,
      headers,
    },
  );

  return response;
}
