"use client";

import { fontCursive } from "@/core/styles";
import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { memo, useReducer } from "react";
import { LoveGiftContent } from "../LoveGiftContent";

function InnerLoveGiftEntrance() {
  const i18n = useI18n();

  const [isShowingLoveGiftContent, toggleLoveGiftContent] = useReducer(
    (state) => !state,
    false,
  );

  const renderLoveGiftEntrance = () => (
    <div className="h-full pb-8 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center mt-8 px-8 text-center">
        <p>{i18n.t("label_love_gift_quote")}</p>
        <PrimaryButton className="mt-8" onClick={toggleLoveGiftContent}>
          {i18n.t("label_click_account")}
        </PrimaryButton>
      </div>
      {/* <p>{i18n.t("label_thank_you")}</p> */}
    </div>
  );

  const renderLoveGiftContent = () => (
    <div className="h-full pb-8 flex flex-col justify-between items-center">
      <div className="mt-12">
        <LoveGiftContent />
      </div>
      <div className="flex flex-col justify-between items-center">
        {/* <p>{i18n.t("label_thank_you")}</p> */}
        <PrimaryButton className="mt-8" onClick={toggleLoveGiftContent}>
          {i18n.t("label_close")}
        </PrimaryButton>
      </div>
    </div>
  );

  return (
    <div className="h-screen relative pt-64">
      {/* pt-64 is to cover the difference between h1 and the content */}
      <h1
        className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className} text-center absolute top-48 left-0 right-0 bottom-0`}
      >
        {i18n.t("title_love_gift")}
      </h1>

      <div className="flex flex-col items-center h-full pb-4 max-w-screen-md">
        {isShowingLoveGiftContent
          ? renderLoveGiftContent()
          : renderLoveGiftEntrance()}{" "}
        <p>{i18n.t("label_thank_you")}</p>
      </div>
    </div>
  );
}

export const LoveGiftEntrance = memo(InnerLoveGiftEntrance);
