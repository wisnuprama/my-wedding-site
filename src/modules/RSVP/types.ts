import { ServiceError } from "../ServiceError";
import { RSVPFormState } from "./actions/submitRSVP";

export type RSVPTokenData = {
  /**
   * RSVP ID
   */
  id: string;
};

export type RSVPUserData = {
  /**
   * User full name
   */
  name: string;

  /**
   * RSVP ID
   */
  rsvpID: string;

  /**
   * Personal message to the invitee
   */
  message?: string;
};

export enum RSVPMode {
  OFF = "off",
  BLESSING = "blessing",
  ELIGIBLE = "eligible",
  FILLED = "filled",
  FILLED_ATTEND = "filled-attend",
}

export type ValidRSVPViewModel = {
  isValidRSVP: true;
  rsvpMode: RSVPMode;
  rsvpUserData: RSVPUserData;
  rsvpToken: string;
  submit: (state: RSVPFormState, formData: FormData) => Promise<RSVPFormState>;
  getFormExtraData: () => Promise<
    [RSVPFormExtraData, undefined] | [undefined, ServiceError]
  >;
};

export type RSVPViewModel =
  | {
      isValidRSVP: false;
      rsvpMode: RSVPMode.OFF;
    }
  | ValidRSVPViewModel;

export type RSVPFormExtraData = {
  /**
   * RSVP status, true if RSVP has been filled, otherwise not filled.
   */
  filled: boolean;
  willAttend: boolean;
  estimatedPax: number;
};

export type EventCardViewModel = {
  redirectTo?: string;
  personName: string;
  qrcodeValue: string;
};

export type RSVPGuestData = {
  id: string;
  name: string;
  pax: number;
  vip: boolean;
  willAttend?: boolean;
  hasCollectedSouvenir?: boolean;
  isAttending?: boolean;
  reason?: string;
};
