"use client";
import React from "react";

export type RSVPContextValue =
  | {
      isValidRSVP: false;
    }
  | {
      isValidRSVP: true;
      data: {
        name: string;
        rsvpID: string;
        message?: string;
      };
    };

export const RSVPContext = React.createContext<RSVPContextValue>({
  isValidRSVP: false,
});
