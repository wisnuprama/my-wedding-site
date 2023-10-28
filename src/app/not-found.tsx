import Link from "next/link";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 */
export const runtime = "edge";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  );
}
