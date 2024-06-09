import { NextResponse } from "next/server";
// @ts-expect-error - no types
import cookie from "cookie";
import { cookies } from "next/headers";
import { UserManager } from "@/modules/Admin";
import { getHostname } from "@/common/nextjs/navigation";

export async function GET(request: Request) {
  const userManager = UserManager.createUserManagerUsingEnvVariable();

  if (request.url.includes("logout")) {
    cookies().delete("ws_a");
    return NextResponse.redirect(new URL("/", getHostname()));
  }

  const userToken = userManager.getCurrentUser()?.token;
  if (userToken && userManager.isValidToken(userToken)) {
    const headers = new Headers();
    headers.set("Content-Type", "text/html");

    const redirectURL = new URL("/admin/guest-book", getHostname());

    const response = new Response(
      `<script>window.location.href = '${redirectURL.toString()}'</script>`,
      {
        status: 200,
        headers,
      },
    );
    return response;
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("p");

  if (!userManager.isValidToken(token)) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const redirectURL = new URL("/admin", getHostname());
  // NOTE: https://github.com/vercel/next.js/discussions/48434#discussioncomment-7843884
  // Issue: https://github.com/wisnuprama/my-wedding-site/issues/46
  // workaround solution
  const headers = new Headers();
  headers.set("Content-Type", "text/html");
  headers.append(
    "Set-Cookie",
    cookie.serialize("ws_a", token, {
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
