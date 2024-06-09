import { NextResponse } from "next/server";
// @ts-expect-error - no types
import cookie from "cookie";
import { cookies } from "next/headers";
import { UserManager } from "@/modules/Admin";
import { getHostname } from "@/common/nextjs/navigation";

export async function GET(request: Request) {
  const userManager = UserManager.createUserManagerUsingEnvVariable();

  if (request.url.includes("logout")) {
    cookies().delete("ws_u");
    return NextResponse.redirect(new URL("/", getHostname()));
  }

  // new token from param
  const url = new URL(request.url);
  const newToken = url.searchParams.get("p");

  const userToken = userManager.getCurrentUser()?.token;
  if (!newToken && userToken && userManager.isValidToken(userToken)) {
    return NextResponse.redirect(new URL("/admin/guest-book", getHostname()));
  }

  if (!userManager.isValidToken(newToken)) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const redirectURL = new URL("/admin/guest-book", getHostname());
  // NOTE: https://github.com/vercel/next.js/discussions/48434#discussioncomment-7843884
  // Issue: https://github.com/wisnuprama/my-wedding-site/issues/46
  // workaround solution
  const headers = new Headers();
  headers.set("Content-Type", "text/html");
  headers.append(
    "Set-Cookie",
    cookie.serialize("ws_u", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      domain: redirectURL.host,

      // 24 hours
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      maxAge: 60 * 60 * 24,
    }),
  );
  headers.append(
    "Set-Cookie",
    cookie.serialize("ws_any", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",

      // 24 hours
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      maxAge: 60 * 60 * 24,
    }),
  );

  const response = new Response(
    `<html>
    <head>
      <title>Admin</title>
      <meta name="description" content="Admin Panel" />
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
