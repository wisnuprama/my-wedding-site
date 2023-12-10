"use client";
import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

type InvitationProps = {};

export default function EventCard(props: InvitationProps) {
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
      className="p-8 rounded-md backdrop-blur-2xl shadow-md w-screen md:w-1/2"
      style={{
        height: "100%",
        background: "rgba(250, 204, 204, 0.5)",
        color: "rgb(var(--foreground-rgb))",
      }}
    >
      <div className="h-full flex flex-col justify-between p-1">
        <p>TEst123</p>
        <div className="flex flex-col justify-between items-center">
          <PrimaryButton onClick={() => router.back()}>
            {i18n.t("label_close")}
          </PrimaryButton>
        </div>
      </div>
    </dialog>
  );
}
