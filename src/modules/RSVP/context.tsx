"use client";
import React from "react";

export interface RSVPContextValue {
  isValidRSVP: boolean;
  data?: { name: string; userId: string; userTitle?: string; message?: string };
}

export const RSVPContext = React.createContext<RSVPContextValue>({
  isValidRSVP: false,
});
