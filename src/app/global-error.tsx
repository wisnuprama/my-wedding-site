"use client";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 */
export const runtime = "edge";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
