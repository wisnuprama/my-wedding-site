"use client";
import { memo } from "react";
import QRCode from "react-qr-code";

type InvitationQRProps = {
  value: string;
};

function InnerInvitationQR({ value }: InvitationQRProps) {
  return (
    <div>
      <QRCode size={200} value={value} />
      <div className="pt-8 flex flex-row">
        <span className="mr-2">ℹ️</span>
        <p>
          Tunjukan QR ini ketika datang atau gunakan kode berikut
          <b>
            <i>{` "${value}" `}</i>
          </b>
          jika ditemukan masalah.
        </p>
      </div>
    </div>
  );
}

export const InvitationQR = memo(InnerInvitationQR);