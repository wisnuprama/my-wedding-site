"use client";

import { PrimaryButton } from "@/components/Link";
import "./globals.css";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

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
