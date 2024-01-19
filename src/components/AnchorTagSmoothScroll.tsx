"use client";

import { useContext, useLayoutEffect } from "react";
import { DisableScrollContext } from "./DisableScroll/context";

export function AnchorTagSmoothScroll() {
  const { enableScroll } = useContext(DisableScrollContext);

  useLayoutEffect(() => {
    /**
     * Return early if no anchor is found or not compatible.
     * When not compatible, fallback to default behavior, which is directly jump to the target.
     */
    function handleClick(e: Event) {
      if (!e.target) {
        return;
      }

      const elem = e.target as HTMLAnchorElement;
      const attrValue = elem.getAttribute("href");
      if (!attrValue) {
        return;
      }

      const targetElem = document.querySelector(attrValue);
      if (!targetElem || !targetElem.scrollIntoView /* check compatibility */) {
        return;
      }

      e.preventDefault();
      targetElem.scrollIntoView({
        behavior: "smooth",
      });
      enableScroll();
    }

    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleClick);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleClick);
      });
    };
  }, [enableScroll]);

  return null;
}
