"use client";

import invariant from "invariant";
import { useLayoutEffect } from "react";

export type ScrollOpacityProps = {
  tagID: string;
  acceleration?: number;
};

export function useScrollOpacity(tagID: string, acceleration: number = 1) {
  useLayoutEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(tagID);

      invariant(element, `Element with ID ${tagID} is not found.`);

      const elementTop = element.offsetTop;
      const elementBottom = element.offsetTop + element.clientHeight;
      const scrollPosition = window.scrollY + window.innerHeight;

      // TODO: improve the calculation
      let opacity =
        1 -
        Math.abs(
          1 -
            Math.abs((elementBottom - scrollPosition) / element.clientHeight) *
              acceleration,
        );

      if (opacity > 0.5) {
        opacity = 1;
      }

      if (opacity >= 0 && opacity <= 1) {
        element?.setAttribute("style", `opacity: ${opacity}`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tagID, acceleration]);
}

/**
 * For SSR, this component will be rendered as null.
 * @param {ScrollOpacityProps} props
 * @returns
 */
export function ScrollOpacity(props: ScrollOpacityProps) {
  const { tagID, acceleration = 1 } = props;
  useScrollOpacity(tagID, acceleration);
  return null;
}
