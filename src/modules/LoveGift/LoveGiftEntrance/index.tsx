"use client";

import { fontCursive } from "@/core/styles";
import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { memo, useRef, useState } from "react";
import { LoveGiftContent } from "../LoveGiftContent";

function InnerLoveGiftEntrance() {
  const i18n = useI18n();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const giftContentEl = useRef<HTMLDivElement>(null);

  const [dialogHeight, setDialogHeight] = useState(0);

  const openDialog = () => {
    if (!giftContentEl.current) {
      return;
    }

    setDialogHeight(giftContentEl.current.clientHeight + 64);
    requestAnimationFrame(() => {
      dialogRef?.current?.showModal?.();
    });
  };
  const closeDialog = () => {
    dialogRef?.current?.close?.();
  };

  const renderLoveGiftEntrance = () => (
    <div className="h-full pb-8 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center mt-8 px-8 text-center">
        <p>{i18n.t("label_love_gift_quote")}</p>
        <PrimaryButton className="mt-8" onClick={openDialog}>
          {i18n.t("label_click_account")}
        </PrimaryButton>
      </div>
    </div>
  );

  const renderLoveGiftContent = (ref?: typeof giftContentEl) => (
    <div ref={ref} className="h-full flex flex-col justify-between">
      <LoveGiftContent />
      <div className="flex flex-col justify-between items-center mt-24">
        <PrimaryButton onClick={closeDialog}>
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
        {renderLoveGiftEntrance()}
        <p>{i18n.t("label_thank_you")}</p>
      </div>

      <div className="fixed opacity-0" style={{ zIndex: -1 }}>
        {renderLoveGiftContent(giftContentEl)}
      </div>

      <dialog
        ref={dialogRef}
        className="p-8"
        style={{
          height: dialogHeight,
        }}
      >
        {renderLoveGiftContent()}
      </dialog>
    </div>
  );
}

export const LoveGiftEntrance = memo(InnerLoveGiftEntrance);
