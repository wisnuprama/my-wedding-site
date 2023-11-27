"use server";

import { getRSVPService } from "../RSVPService";
import { RSVPTokenManager } from "../RSVPTokenManager";
import { submitRSVP } from "./submitRSVP";
import { RSVPFormExtraData, RSVPUserData, RSVPViewModel } from "../types";
import { ServiceError } from "@/modules/ServiceError";

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

  if (!isValidRSVP) {
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

  const start = performance.now();
  const [userDataFromDb, err] = await rsvpService.getUserData(tokenData.id);
  console.info(
    "[Profiler] rsvpService.getUserData took",
    performance.now() - start,
    "ms",
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
    rsvpUserData: userData,
    submit: submitRSVP,
    getFormExtraData: async () => {
      const start = performance.now();
      const extraData = await rsvpService.getFormExtraData(tokenData.id);
      console.info(
        "[Profiler] rsvpService.getFormExtraData took",
        performance.now() - start,
        "ms",
      );

      return extraData;
    },
  };
}
