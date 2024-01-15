"use client";
import { useI18n } from "@/core/i18n";
import React, { useCallback, useContext } from "react";
import { PrimaryLink } from "@/components/Link";
import { DisableScrollContext } from "@/components/DisableScroll/context";
import { RSVPContext, RSVPMode } from "@/modules/RSVP";

export function OpenInvitationButton() {
  const i18n = useI18n();
  const { enableScroll } = useContext(DisableScrollContext);
  const rsvp = useContext(RSVPContext);

  console.log(rsvp);

  const handleLink = useCallback(() => enableScroll(), [enableScroll]);

  const btnTextKey =
    rsvp.rsvpMode === RSVPMode.FULL ? "label_open_invitation" : "label_open";

  return (
    <PrimaryLink className="text-base mt-4" href="#pg-2" onClick={handleLink}>
      {i18n.t(btnTextKey)}
    </PrimaryLink>
  );
}
