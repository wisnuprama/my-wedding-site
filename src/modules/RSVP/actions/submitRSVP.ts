"use server";

import { getServerI18n } from "@/core/i18n";
import { RSVPFormDTO } from "../dto";
import { getRSVPService } from "../RSVPService";
import { RSVPTokenManager } from "../RSVPTokenManager";

export type RSVPFormState = {
  message: string | null | undefined;
  status: "ok" | "error" | null;
  redirectTo?: string;
};

export async function submitRSVP(
  _: RSVPFormState,
  form: FormData,
): Promise<RSVPFormState> {
  const rsvpToken = form.get("rsvpToken");

  if (!rsvpToken) {
    console.warn("[submitRSVP] Submitting form without token");
    return {
      status: "error",
      message: getServerI18n().t("msg_submit_error"),
    };
  }

  const manager = new RSVPTokenManager();

  const [isValidRSVP, tokenData] = await manager.verifyAndDecodeToken(
    rsvpToken.toString(),
  );

  if (!isValidRSVP) {
    return {
      status: "error",
      message: getServerI18n().t("msg_submit_error"),
    };
  }

  const rsvp = new RSVPFormDTO(
    form.get("actualPax")?.toString(),
    form.get("willAttend")?.toString(),
    form.get("wishMessage")?.toString(),
  );

  const rsvpService = await getRSVPService();

  try {
    rsvp.validate();

    const resp = await rsvpService.fillRSVPById(tokenData.id, rsvp);

    if (resp.error) {
      console.warn(
        "[submitRSVP] Failed to update RSVP",
        JSON.stringify({
          ...rsvp.toObject(),
          rsvpId: tokenData.id,
        }),
      );
      return {
        status: "error",
        message: getServerI18n().t("msg_submit_error"),
      };
    }

    const shouldRedirect = await rsvpService.shouldDisplayEventCard(
      tokenData.id,
    );

    return {
      status: "ok",
      redirectTo: shouldRedirect ? "/event-card" : undefined,
      message: getServerI18n().t("msg_submit_success"),
    };
  } catch (e) {
    const err = e as Error;

    console.error(
      "[submitRSVP] Exception when updating RSVP",
      JSON.stringify({
        ...rsvp.toObject(),
        rsvpId: tokenData.id,
        error: err.message,
      }),
    );

    return {
      status: "error",
      message: err.message ?? getServerI18n().t("msg_submit_error"),
    };
  }
}
