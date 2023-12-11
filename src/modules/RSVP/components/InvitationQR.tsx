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
      <p className="text-center">{i18n.t("msg_qrcode_description")}</p>
      <div className="mt-4 p-2 bg-white shadow-inner rounded-md">
        <QRCode size={140} value={value} />
      </div>
      <div className="relative p-4 flex flex-row items-center">
        <p className="uppercase text-2xl font-bold font-mono">{value}</p>
        <IcInfo
          fontSize="small"
          className="absolute cursor-pointer active:opacity-50"
          style={{ right: -10 }}
          onClick={() => {
            window.alert(i18n.t("msg_qrcode_tooltip_help"));
          }}
        />
      </div>
    </div>
  );
}

export const InvitationQR = memo(InnerInvitationQR);
