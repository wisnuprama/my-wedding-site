"use client";
import { memo } from "react";
import QRCode from "react-qr-code";
import IcInfo from "@material-ui/icons/InfoOutlined";
import { useI18n } from "@/core/i18n";

type InvitationQRProps = {
  value: string;
};

function InnerInvitationQR({ value }: InvitationQRProps) {
  const i18n = useI18n();

  const warnHandler = () => {
    window.alert(i18n.t("msg_qrcode_tooltip_help"));
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-center">{i18n.t("msg_qrcode_description")}</p>
      <div
        className="mt-4 p-2 bg-white shadow-inner rounded-md cursor-pointer active:opacity-50"
        onClick={warnHandler}
      >
        <QRCode size={140} value={value} />
      </div>
      <div
        className="relative p-4 flex flex-row items-center cursor-pointer active:opacity-50"
        onClick={warnHandler}
      >
        <p className="uppercase text-2xl font-bold font-mono">{value}</p>
        <IcInfo fontSize="small" className="absolute" style={{ right: -10 }} />
      </div>
    </div>
  );
}

export const InvitationQR = memo(InnerInvitationQR);
