"use client";

import { useLayoutEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export function VideoAutoPlay() {
  useLayoutEffect(() => {
    const body = document.querySelector("body");

    const options: Parameters<typeof window.addEventListener>[2] = {
      capture: false,
      passive: true,
    };

    async function trigger() {
      const videoElement = document.getElementById(
        "home-video",
      ) as HTMLVideoElement;

      try {
        await videoElement.play();
      } catch (e: any) {
        if ("name" in e && e.name === "NotAllowedError") {
          Sentry.captureMessage("Video autoplay is not allowed", {
            level: "warning",
            tags: {
              userJourney: "video-autoplay",
              actionRequired: "monitor",
            },
          });
          return;
        }

        Sentry.captureException(e, {
          tags: {
            userJourney: "video-autoplay",
            actionRequired: "investigation",
          },
        });
      }

      body?.removeEventListener("click", trigger, options);
      body?.removeEventListener("touchstart", trigger, options);
    }

    body?.addEventListener("click", trigger, options);
    body?.addEventListener("touchstart", trigger, options);
  }, []);

  return null;
}
