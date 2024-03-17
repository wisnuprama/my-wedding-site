"use client";

import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { RSVPContext } from "@/modules/RSVP";
import { memo, useContext, useReducer, useRef } from "react";

type PersonalMessageProps = {};

function _PersonalMessage(_: PersonalMessageProps) {
  const i18n = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const msgContent = useRef<HTMLDivElement>(null);

  // Because of some limitation when using dangerouslySetInnerHTML
  // and the content has HTML tag and could be long, the content will be cut off.
  // So we will use state instead and display the msg when the dialog is opened
  const [shouldDisplayMessage, showMessage] = useReducer(() => true, false);

  const rsvp = useContext(RSVPContext);

  if (!rsvp.isValidRSVP || !rsvp.data?.message) {
    return null;
  }

  const personalMessage = rsvp.data?.message;

  if (!personalMessage) {
    return null;
  }

  const openDialog = () => {
    if (!msgContent.current) {
      return;
    }
    showMessage(); // show message
    requestAnimationFrame(() => {
      dialogRef?.current?.showModal?.();
    });
  };
  const closeDialog = () => {
    dialogRef?.current?.close?.();
  };

  const paddingSize = 2;

  return (
    <div className="pt-8">
      <PrimaryButton className="text-base" onClick={openDialog}>
        {i18n.t("label_button_see_special_msg")}
      </PrimaryButton>

      <dialog
        ref={dialogRef}
        className={`p-[2rem] rounded-md backdrop-blur-2xl shadow-md w-screen md:w-1/2 min-h-[80vh] md:min-h-[25vh] max-h-[80vh] md:max-h-[80vh] overflow-y-auto`}
        style={{
          background: "rgba(var(--background-dialog))",
          color: "rgb(var(--foreground-rgb))",
        }}
      >
        <div
          ref={msgContent}
          className={`min-h-[calc(80vh-4rem)] md:min-h-[calc(25vh-4rem)] flex flex-col justify-between`}
        >
          {shouldDisplayMessage && (
            <p dangerouslySetInnerHTML={{ __html: personalMessage }} />
          )}
          <div className="flex flex-col justify-between items-center mt-4">
            <PrimaryButton onClick={closeDialog}>
              {i18n.t("label_close")}
            </PrimaryButton>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export const PersonalMessage = memo(_PersonalMessage);
