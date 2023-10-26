"use client";
import { RSVPContext, RSVPContextValue } from "../context";

export type RSVPProviderProps = {
  value: RSVPContextValue;
  children: React.ReactNode;
};

export function RSVPContextProvider(props: RSVPProviderProps) {
  const { children, value } = props;
  return <RSVPContext.Provider value={value}>{children}</RSVPContext.Provider>;
}
