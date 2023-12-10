"use client";
import { useI18n } from "@/core/i18n";
import React, { useCallback, useContext } from "react";
import { PrimaryLink } from "@/components/Link";
import { DisableScrollContext } from "@/components/DisableScroll/context";

export function OpenInvitationButton() {
  const i18n = useI18n();
  const { enableScroll } = useContext(DisableScrollContext);

  const handleLink = useCallback(() => enableScroll(), [enableScroll]);

  return (
    <PrimaryLink className="text-xl mt-4" href="#pg-2" onClick={handleLink}>
      {i18n.t("label_open_invitation")}
    </PrimaryLink>
  );
}
