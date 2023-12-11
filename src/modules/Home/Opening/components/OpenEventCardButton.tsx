"use client";
import { useI18n } from "@/core/i18n";
import React, { SyntheticEvent, useCallback, useContext } from "react";
import { PrimaryLink } from "@/components/Link";
import { DisableScrollContext } from "@/components/DisableScroll/context";
import { useRouter } from "next/navigation";

export function OpenEventCardButton() {
  const i18n = useI18n();
  const router = useRouter();

  const { enableScroll } = useContext(DisableScrollContext);

  const handleLink = useCallback(
    (e: SyntheticEvent) => {
      // prevent anchor tag to navigate users
      e.preventDefault();
      // prevent jumping after closing dialog
      window.scrollTo(0, 0);
      // so users can scroll after closing dialog
      enableScroll();
      // actually navigate users to the page
      router.push("/event-card");
    },
    [enableScroll, router],
  );

  return (
    <PrimaryLink
      className="text-xl mt-4"
      href="/event-card"
      onClick={handleLink}
    >
      {i18n.t("label_see_your_invitation_card")}
    </PrimaryLink>
  );
}
