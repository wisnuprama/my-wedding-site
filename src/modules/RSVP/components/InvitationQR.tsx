"use client"

function InnerInvitationQR() {
  return (
    <>
      <h2 className="text-4xl font-medium mb-16 md:mb-36">Invitation</h2>
      <div>
        {/* @ts-expect-error hack */}
        <QRCode size={200} value={invitationCode} />
        <div className="pt-8 flex flex-row">
          <span className="mr-2">ℹ️</span>
          <p>
            Tunjukan QR ini ketika datang atau gunakan kode berikut
            <b>
              <i>{` "${invitationCode}" `}</i>
            </b>
            jika ditemukan masalah.
          </p>
        </div>
      </div>
    </>
  );
}
