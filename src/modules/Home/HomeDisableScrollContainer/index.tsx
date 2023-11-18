"use client";
import {
  DisableScrollContainer,
  DisableScrollProps,
} from "@/modules/DisableScroll";
import { DisableScrollContext } from "@/modules/DisableScroll/context";
import { useContext, useLayoutEffect, useMemo } from "react";

export type HomeDisableScrollProps = {
  children: React.ReactNode;
};

/**
 * Double check again after render if initialValue can't be determined
 * fast enough.
 */
export function ScrollableCheck() {
  const { enableScroll } = useContext(DisableScrollContext);

  useLayoutEffect(() => {
    const w = typeof window !== "undefined" ? window : null;

    if (!w) {
      return;
    }

    // trigger in the next event loop
    const timeout = setTimeout(() => {
      if (w.scrollY > 0) {
        enableScroll();
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [enableScroll]);

  return null;
}

export function HomeDisableScrollContainer(props: HomeDisableScrollProps) {
  // if the URL contains anchor
  const initialValue = useMemo<DisableScrollProps["initialValue"]>(() => {
    const w = typeof window !== "undefined" ? window : null;

    if (!w) {
      return "enabled";
    }

    if (w.scrollY > 0) {
      return "enabled";
    }

    return w.location.href.includes("/#") ? "enabled" : "disabled";
  }, []);

  return (
    <DisableScrollContainer initialValue={initialValue}>
      <ScrollableCheck />
      {props.children}
    </DisableScrollContainer>
  );
}
