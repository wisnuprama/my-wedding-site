"use client";

import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { RSVPContext } from "@/modules/RSVP";
import { memo, useContext, useRef } from "react";

type SpecialMessageProps = {};

function _SpecialMessage(props: SpecialMessageProps) {
  const i18n = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const msgContent = useRef<HTMLDivElement>(null);

  const rsvp = useContext(RSVPContext);

  if (!rsvp.isValidRSVP) {
    return null;
  }

  const specialMessage = rsvp.data?.message;

  const openDialog = () => {
    if (!msgContent.current) {
      return;
    }
    requestAnimationFrame(() => {
      dialogRef?.current?.showModal?.();
    });
  };
  const closeDialog = () => {
    dialogRef?.current?.close?.();
  };

  return (
    <div className="pt-8">
      <PrimaryButton onClick={openDialog}>
        {i18n.t("label_button_see_special_msg")}
      </PrimaryButton>

      <dialog
        ref={dialogRef}
        className="p-8 rounded-md backdrop-blur-2xl shadow-md"
        style={{
          height: "25vh",
          width: "100vw",
          background: "rgba(var(--background-dialog))",
          color: "rgb(var(--foreground-rgb))",
        }}
      >
        <div
          ref={msgContent}
          className="h-full flex flex-col justify-between p-1"
        >
          <p>{specialMessage}</p>
          <div className="flex flex-col justify-between items-center">
            <PrimaryButton onClick={closeDialog}>
              {i18n.t("label_close")}
            </PrimaryButton>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export const SpecialMessage = memo(_SpecialMessage);
