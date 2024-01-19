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
  isFilled: (rsvpID: string) => Promise<boolean>;
  willAttend: (rsvpID: string) => Promise<boolean>;
  getUserData: (
    rsvpID: string,
  ) => Promise<[RSVPUserData, undefined] | [undefined, ServiceError]>;
  getFormExtraData: (
    rsvpID: string,
  ) => Promise<[RSVPFormExtraData, undefined] | [undefined, ServiceError]>;
  isEligibleForRSVP: (rsvpID: string) => Promise<boolean>;
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

  let rsvpMode = RSVPMode.BLESSING;
  if (await rsvpService.willAttend(tokenData.id)) {
    rsvpMode = RSVPMode.FILLED_ATTEND;
  } else if (await rsvpService.isFilled(tokenData.id)) {
    rsvpMode = RSVPMode.FILLED;
  } else if (await rsvpService.isEligibleForRSVP(tokenData.id)) {
    rsvpMode = RSVPMode.FULL;
  }

  return {
    isValidRSVP,
    rsvpMode,
    rsvpToken,
    rsvpUserData: userData,
    submit: submitRSVP,
    getFormExtraData: async () => {
      return withPerfTraceLog("rsvpService.getFormExtraData", () =>
        rsvpService.getFormExtraData(tokenData.id),
      );
    },
  };
}
