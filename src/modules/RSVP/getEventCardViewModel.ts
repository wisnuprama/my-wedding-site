"use server";

import { getRSVPService } from "./RSVPService";
import { RSVPTokenManager } from "./RSVPTokenManager";
import { submitRSVP } from "./actions";
import {
  EventCardViewModel,
  RSVPFormExtraData,
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
}

export async function getEventCardViewModel(): Promise<EventCardViewModel> {
  const manager = new RSVPTokenManager();

  const rsvpToken = manager.getTokenFromCookie();

  const [isValidRSVP, tokenData] =
    await manager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP) {
    return {
      redirectTo: "/",
      personName: "",
      qrcodeValue: "",
    };
  }

  const userData: RSVPUserData = {
    name: "",
    rsvpID: tokenData.id,
  };

  const rsvpService: RSVPService = await getRSVPService();

  const [userDataFromDb, err] = await rsvpService.getUserData(tokenData.id);
  // replace with data from db if available
  if (userDataFromDb) {
    userData.name = userDataFromDb.name;
    userData.message = userDataFromDb.message;
  } else {
    console.warn(
      "[getEventCardViewModel] Error when getting userdata from DB",
      err,
    );
  }

  const redirectTo = (await rsvpService.shouldDisplayEventCard(tokenData.id))
    ? undefined
    : "/";

  return {
    personName: userData.name,
    qrcodeValue: userData.rsvpID,
    redirectTo,
  };
}
