"use client";
import { useI18n } from "@/core/i18n";
import React, { useCallback, useContext, useMemo } from "react";
import { PrimaryLink } from "@/components/Link";
import { DisableScrollContext } from "@/components/DisableScroll/context";
import { RSVPContext, RSVPMode } from "@/modules/RSVP";

export function OpenInvitationButton() {
  const i18n = useI18n();
  const { enableScroll } = useContext(DisableScrollContext);
  const rsvp = useContext(RSVPContext);

  const handleLink = useCallback(() => enableScroll(), [enableScroll]);

  const btnTextKey = useMemo(
    () =>
      [RSVPMode.FULL, RSVPMode.FILLED_ATTEND, RSVPMode.FILLED].includes(
        rsvp.rsvpMode,
      )
        ? "label_open_invitation"
        : "label_open",
    [rsvp.rsvpMode],
  );

  return (
    <PrimaryLink className="text-base mt-4" href="#pg-2" onClick={handleLink}>
      {i18n.t(btnTextKey)}
    </PrimaryLink>
  );
}
