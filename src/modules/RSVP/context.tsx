"use client";
import React from "react";
import { RSVPMode } from "./types";

export type RSVPContextValue =
  | {
      isValidRSVP: false;
      rsvpMode: RSVPMode;
    }
  | {
      isValidRSVP: true;
      rsvpMode: RSVPMode;
      data: {
        name: string;
        rsvpID: string;
        message?: string;
      };
    };

export const RSVPContext = React.createContext<RSVPContextValue>({
  isValidRSVP: false,
  rsvpMode: RSVPMode.OFF,
});
