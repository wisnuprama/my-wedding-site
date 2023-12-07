"use client";

import { useLayoutEffect } from "react";

export function VideoAutoPlay() {
  useLayoutEffect(() => {
    const body = document.querySelector("body");

    function trigger() {
      var videoElement = document.getElementById(
        "home-video",
      ) as HTMLVideoElement;

      videoElement.play();

      body?.removeEventListener("click", trigger);
      body?.removeEventListener("touchstart", trigger);
    }

    body?.addEventListener("click", trigger);
    body?.addEventListener("touchstart", trigger);
  }, []);

  return null;
}
