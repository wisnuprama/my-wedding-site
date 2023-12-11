"use client";
import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { InvitationQR } from "@/modules/RSVP";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

type ClientProps = {
  personName: string;
  qrcodeValue: string;
};

export function EventCardClient(props: ClientProps) {
  const { personName, qrcodeValue } = props;
  const router = useRouter();

  const i18n = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const openDialog = () => {
      requestAnimationFrame(() => {
        dialogRef?.current?.showModal?.();
      });
    };

    openDialog();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="p-8 rounded-md backdrop-blur-2xl shadow-md w-full md:w-4/5 lg:w-1/2"
      style={{
        height: "100%",
        background: "rgba(250, 204, 204, 0.5)",
        color: "rgb(var(--foreground-rgb))",
      }}
    >
      <div className="h-full flex flex-col justify-between p-1">
        <main className="h-full flex flex-col items-center overflow-scroll">
          <h1 className={`${fontCursive.className} text-4xl text-center mb-6`}>
            {i18n.t("title_event_card")}
          </h1>
          <p className="text-2xl mb-12">
            {i18n.t("label_dear")}, {personName}
          </p>
          <InvitationQR value={qrcodeValue} />
          <div></div>
        </main>
        <div className="flex flex-col justify-between items-center">
          <PrimaryButton onClick={() => router.back()}>
            {i18n.t("label_close")}
          </PrimaryButton>
        </div>
      </div>
    </dialog>
  );
}
