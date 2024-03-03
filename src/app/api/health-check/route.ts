import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(req: Request) {
  if (req.headers.get("Authorization") !== process.env.API_KEY) {
    return NextResponse.json({ ok: false });
  }

  const abortCont = new AbortController();

  const timeout = setTimeout(() => {
    abortCont.abort();
  }, 30000);

  const result = await fetch(
    "https://nadiawisnu.wedding/rsvp?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjRCRCIsIm5tIjoiSGlseWEgJiBBYmkifQ.UPB9syvxzOagFQ0FCXqg0cp91OKoLVt9nHKjNmZFn0I",
    {
      signal: abortCont.signal,
      headers: {
        "accept-language": "en-GB",
      },
    },
  ).finally(() => {
    clearTimeout(timeout);
  });

  if (result.status >= 400) {
    console.log(result.statusText);
    Sentry.captureMessage("Failed to ping RSVP endpoint", {
      level: "warning",
      tags: { type: "healthcheck" },
    });
  }

  return NextResponse.json({ ok: true });
}
