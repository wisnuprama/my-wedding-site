"use server";

import { getRSVPService } from "../RSVPService";
import { RSVPTokenManager } from "../RSVPTokenManager";
import { submitRSVP } from "./submitRSVP";
import { RSVPFormExtraData, RSVPUserData, RSVPViewModel } from "../types";
import { ServiceError } from "@/modules/ServiceError";
import { withPerfTraceLog } from "@/modules/PerfTrace";

interface RSVPService {
  getUserData: (
    rsvpID: string,
  ) => Promise<[RSVPUserData, undefined] | [undefined, ServiceError]>;
  getFormExtraData: (
    rsvpID: string,
  ) => Promise<[RSVPFormExtraData, undefined] | [undefined, ServiceError]>;
}

export async function getRSVPViewModel(
  rsvpToken: string | undefined,
): Promise<RSVPViewModel> {
  const manager = new RSVPTokenManager();

  const [isValidRSVP, tokenData] =
    await manager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP || !rsvpToken) {
    return {
      isValidRSVP: false,
    };
  }

  const userData = {
    name: tokenData.nm,
    rsvpID: tokenData.id,
    message: tokenData.m,
  };

  const rsvpService: RSVPService = await getRSVPService();

  const [userDataFromDb, err] = await withPerfTraceLog(
    "rsvpService.getUserData",
    () => rsvpService.getUserData(tokenData.id),
  );

  // replace with data from db if available
  if (userDataFromDb) {
    userData.name = userDataFromDb.name;
    userData.message = userDataFromDb.message;
  } else {
    console.warn("[getRSVPViewModel] Error when getting userdata from DB", err);
  }

  return {
    isValidRSVP,
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
