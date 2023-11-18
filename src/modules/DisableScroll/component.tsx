"use client";

import { DisableScrollContext } from "./context";
import { useDisableScroll, useDisableScrollManager } from "./hooks";

export type DisableScrollProps = {
  children: React.ReactNode;
  initialValue?: "enabled" | "disabled";
};

export function DisableScrollContainer(props: DisableScrollProps) {
  const { children, initialValue } = props;

  useDisableScroll(initialValue);
  const manager = useDisableScrollManager();

  return (
    <DisableScrollContext.Provider value={manager}>
      {children}
    </DisableScrollContext.Provider>
  );
}
