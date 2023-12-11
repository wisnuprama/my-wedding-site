"use client";

import { PrimaryButton } from "@/components/Link";
import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="h-screen flex flex-col justify-center items-center">
          <p className="text-2xl mb-4">Something went wrong!</p>
          <PrimaryButton onClick={() => reset()}>Try again</PrimaryButton>
        </div>
      </body>
    </html>
  );
}
