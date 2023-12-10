import { RSVPTokenManager } from "@/modules/RSVP/RSVPTokenManager";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rsvpToken = url.searchParams.get("t");

  const response = NextResponse.redirect(new URL("/", request.url));

  if (!rsvpToken) {
    console.warn("[rsvp.GET] No RSVP token provided");
    return response;
  }

  const manager = new RSVPTokenManager();

  const [isValidRSVP] = await manager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP) {
    console.warn("[rsvp.GET] Invalid RSVP token provided", { rsvpToken });
    return response;
  }

  response.cookies.set("ws_r", rsvpToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",

    // 10 years
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
    maxAge: 60 * 60 * 24 * 365 * 10,
  });

  return response;
}
