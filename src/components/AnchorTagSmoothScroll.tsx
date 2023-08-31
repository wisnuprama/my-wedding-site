"use client";

import { useLayoutEffect } from "react";

export function AnchorTagSmoothScroll() {
  useLayoutEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener(
        "click",
        /**
         * Return early if no anchor is found or not compatible.
         * When not compatible, fallback to default behavior, which is directly jump to the target.
         */
        function (e) {
          if (!e.target) {
            return;
          }

          const elem = e.target as HTMLAnchorElement;
          const attrValue = elem.getAttribute("href");
          if (!attrValue) {
            return;
          }

          const targetElem = document.querySelector(attrValue);
          if (
            !targetElem ||
            !targetElem.scrollIntoView /* check compatibility */
          ) {
            return;
          }

          e.preventDefault();
          targetElem.scrollIntoView({
            behavior: "smooth",
          });
        }
      );
    });
  }, []);

  return null;
}
