"use server";

import { getRSVPService } from "./RSVPService";
import { RSVPTokenManager } from "./RSVPTokenManager";
import { submitRSVP } from "./actions";
import {
  RSVPFormExtraData,
  RSVPMode,
  RSVPUserData,
  RSVPViewModel,
} from "./types";
import { ServiceError } from "@/modules/ServiceError";
import { withPerfTraceLog } from "@/modules/PerfTrace";

interface RSVPService {
  shouldDisplayEventCard: (rsvpID: string) => Promise<boolean>;
  getUserData: (
    rsvpID: string,
  ) => Promise<[RSVPUserData, undefined] | [undefined, ServiceError]>;
  getFormExtraData: (
    rsvpID: string,
  ) => Promise<[RSVPFormExtraData, undefined] | [undefined, ServiceError]>;
  isEligibleForRSVP: (
    rsvpID: string,
  ) => Promise<[boolean, undefined] | [undefined, ServiceError]>;
}

export async function getRSVPViewModel(): Promise<RSVPViewModel> {
  const manager = new RSVPTokenManager();

  const rsvpToken = manager.getTokenFromCookie();

  const [isValidRSVP, tokenData] =
    await manager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP || !rsvpToken) {
    return {
      isValidRSVP: false,
      rsvpMode: RSVPMode.OFF,
    };
  }

  const userData = {
    name: tokenData.nm,
    rsvpID: tokenData.id,
    message: tokenData.m,
  };

  const rsvpService: RSVPService = await getRSVPService();

  const [serverUserData, err] = await withPerfTraceLog(
    "rsvpService.getUserData",
    () => rsvpService.getUserData(tokenData.id),
  );

  // replace with data from db if available
  if (serverUserData) {
    userData.name = serverUserData.name;
    userData.message = serverUserData.message;
  } else {
    console.warn("[getRSVPViewModel] Error when getting userdata from DB", err);
  }

  const [isEligibleForRSVP, err2] = await rsvpService.isEligibleForRSVP(
    tokenData.id,
  );

  if (err2) {
    console.warn(
      "[getRSVPViewModel] Error when getting isEligibleForRSVP from DB",
      err2,
    );
  }

  let rsvpMode = RSVPMode.BLESSING;
  if (isEligibleForRSVP) {
    rsvpMode = RSVPMode.FULL;
  }

  return {
    isValidRSVP,
    rsvpMode,
    rsvpToken,
    rsvpUserData: userData,
    shouldDisplayEventCard: async () => {
      return withPerfTraceLog("rsvpService.shouldDisplayEventCard", () =>
        rsvpService.shouldDisplayEventCard(tokenData.id),
      );
    },
    submit: submitRSVP,
    getFormExtraData: async () => {
      return withPerfTraceLog("rsvpService.getFormExtraData", () =>
        rsvpService.getFormExtraData(tokenData.id),
      );
    },
  };
}
