"use server";

import { getServerI18n } from "@/core/i18n";
import { RSVPFormDTO } from "../dto";
import { getRSVPService } from "../RSVPService";
import { RSVPTokenManager } from "../RSVPTokenManager";
import * as Sentry from "@sentry/nextjs";

export type RSVPFormState = {
  message: string | null | undefined;
  status: "ok" | "error" | null;
  redirectTo?: string;
};

async function _submitRSVP(
  _: RSVPFormState,
  form: FormData,
): Promise<RSVPFormState> {
  const rsvpToken = form.get("rsvpToken")?.toString();

  if (!rsvpToken) {
    console.warn("[submitRSVP] Submitting form without token");
    return {
      status: "error",
      message: getServerI18n().t("msg_submit_error"),
    };
  }

  const manager = new RSVPTokenManager();

  const [isValidRSVP, tokenData] =
    await manager.verifyAndDecodeToken(rsvpToken);

  if (!isValidRSVP) {
    return {
      status: "error",
      message: getServerI18n().t("msg_submit_error"),
    };
  }

  const rsvpService = await getRSVPService();

  const [__, err] = await rsvpService.getUserData(tokenData.id);

  if (err) {
    console.error(
      "[submitRSVP] Failed to get the user data",
      JSON.stringify({
        rsvpId: tokenData.id,
        error: err.message,
      }),
    );
    return {
      status: "error",
      message: getServerI18n().t("msg_submit_error"),
    };
  }

  // when user is eligible for RSVP
  const isEligibleForRSVP = await rsvpService.isEligibleForRSVP(tokenData.id);
  // get the actual pax from the form
  // otherwise, assume the users are not attending, and set the actual pax to 0
  const actualPax = isEligibleForRSVP ? form.get("actualPax")?.toString() : "0";
  // get the willAttend from the form
  // otherwise, assume the users are not attending, and set the willAttend to false
  const willAttend = isEligibleForRSVP
    ? form.get("willAttend")?.toString()
    : "false";

  let rsvp = new RSVPFormDTO(
    actualPax,
    willAttend,
    form.get("wishMessage")?.toString(),
  );

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

      Sentry.captureMessage(`Submit RSVP error`, {
        level: "warning",
        extra: {
          ...rsvp.toObject(),
          rsvpId: tokenData.id,
          errorMsg: resp.errorMsg,
        },
        tags: {
          actionRequired: "contact_support",
          userJourney: "submit-rsvp",
        },
      });

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

    Sentry.captureException(err, {
      level: "error",
      extra: {
        ...rsvp.toObject(),
        rsvpId: tokenData.id,
        errorMsg: err.message,
      },
      tags: {
        userJourney: "submit-rsvp",
        actionRequired: "investigation",
      },
    });

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
      message: `Internal error. ${getServerI18n().t("msg_submit_error")}`,
    };
  }
}

function withErrorBoundary<F extends (...args: any[]) => any>(fn: F): F {
  return (async (...args: any[]) => {
    try {
      return fn(...args);
    } catch (e) {
      const err = e as Error;
      Sentry.captureException(err, {
        level: "error",
        tags: {
          userJourney: "submit-rsvp",
          actionRequired: "investigation",
        },
      });

      console.error("[withErrorBoundary] Error occurred", e);
      return {
        status: "error",
        message: `Internal error. ${getServerI18n().t("msg_submit_error")}`,
      };
    }
  }) as F;
}

export const submitRSVP = withErrorBoundary(_submitRSVP);
