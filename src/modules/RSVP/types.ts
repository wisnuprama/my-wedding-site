import { ServiceErrorCode } from "@/modules/ServiceError/errorcode";
import { type } from "os";
import { ServiceError } from "../ServiceError";

export type RSVPTokenData = {
  /**
   * RSVP ID
   */
  id: string;
  /**
   * User full name
   */
  nm: string;
  /**
   * Personal message to the invitee
   */
  m?: string;
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

export type ValidRSVPViewModel = {
  isValidRSVP: true;
  rsvpUserData: RSVPUserData;
  submit: (formData: FormData) => Promise<void>;
  getFormExtraData: () => Promise<
    [RSVPFormExtraData, undefined] | [undefined, ServiceError]
  >;
};

export type RSVPViewModel =
  | {
      isValidRSVP: false;
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
