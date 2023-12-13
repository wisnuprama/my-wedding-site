import { RSVPTokenManager } from "@/modules/RSVP/RSVPTokenManager";
import { NextResponse } from "next/server";
// @ts-expect-error - no types
import cookie from "cookie";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rsvpToken = url.searchParams.get("t");

  if (!rsvpToken) {
    console.warn("[rsvp.GET] No RSVP token provided");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const tokenManager = new RSVPTokenManager();

  const [isValidRSVP, tokenData] =
    await tokenManager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP) {
    console.warn("[rsvp.GET] Invalid RSVP token provided", { rsvpToken });
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.info("[rsvp.GET] Valid token. Setting up RSVP cookies", {
    id: tokenData.id,
  });

  // NOTE: https://github.com/vercel/next.js/discussions/48434#discussioncomment-7843884
  // Issue: https://github.com/wisnuprama/my-wedding-site/issues/46
  // workaround solution
  const response = new Response("<script>window.location.href = '/'</script>", {
    status: 200,
    headers: {
      "Content-Type": "text/html", // Setting the response type as text/html
      "Set-Cookie": cookie.serialize("ws_r", rsvpToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",

        // 10 years
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
        maxAge: 60 * 60 * 24 * 365 * 10,
      }),
    },
  });
  // const response = NextResponse.redirect(new URL("/", request.url));
  // response.cookies.set("ws_r", rsvpToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "strict",
  //   path: "/",
  //   // 10 years
  //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
  //   maxAge: 60 * 60 * 24 * 365 * 10,
  // });

  return response;
}
