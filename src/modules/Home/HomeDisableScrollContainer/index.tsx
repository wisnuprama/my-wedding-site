"use client";
import {
  DisableScrollContainer,
  DisableScrollProps,
} from "@/modules/DisableScroll";
import { useMemo } from "react";

export type HomeDisableScrollProps = {
  children: React.ReactNode;
};

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
      {props.children}
    </DisableScrollContainer>
  );
}
