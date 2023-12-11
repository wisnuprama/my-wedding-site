"use client";
import { memo } from "react";
import QRCode from "react-qr-code";
import IcInfo from "@material-ui/icons/InfoOutlined";
import { IcButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";

type InvitationQRProps = {
  value: string;
};

function InnerInvitationQR({ value }: InvitationQRProps) {
  const i18n = useI18n();
  return (
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white shadow-inner">
        <QRCode size={200} value={value} />
      </div>
      <div className="p-4 flex flex-row items-center">
        <p className="uppercase text-xl">
          <b>{value}</b>
        </p>
        <IcButton
          className="drop-shadow-none"
          onClick={() => {
            window.alert(i18n.t("msg_qrcode_help"));
          }}
        >
          <IcInfo />
        </IcButton>
      </div>
    </div>
  );
}

export const InvitationQR = memo(InnerInvitationQR);
