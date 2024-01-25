"use client";
import { PrimaryAnchor } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { InvitationQR } from "@/modules/RSVP";
import { useRouter } from "next/navigation";
import { Fragment, useLayoutEffect, useReducer, useRef } from "react";
import config from "@/core/config";

type EventCardClient = {
  personName: string;
  qrcodeValue: string;
};

export function EventCardClient(props: EventCardClient) {
  const { personName, qrcodeValue } = props;
  const router = useRouter();
  const [canInteract, enableInteraction] = useReducer(() => true, false);

  const i18n = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const weddingDate = config.WEDDING_DAY_TIMESTAMP;
  const schedules = config.SCHEDULES;
  const mapURL = canInteract ? config.VENUE_MAP_URL : undefined;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    // dialog.inert = false;
    dialog.showModal();
    // hacky way to make sure the dialog not autofocus to href
    enableInteraction();
  }, []);

  const timeFormatter = new Intl.DateTimeFormat(i18n.getLocale(), {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZoneName: "short",
    timeZone: "Asia/Jakarta",
  });
  const dateFormatter = new Intl.DateTimeFormat(i18n.getLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <dialog
      ref={dialogRef}
      // we should h-fit, but safari does not support. Must hardcode specific value
      className="rounded-md backdrop-blur-2xl shadow-md w-full md:w-4/5 lg:w-1/2 h-full md:h-5/6"
      style={{
        background: "rgba(250, 204, 204, 0.5)",
        color: "rgb(var(--foreground-rgb))",
      }}
    >
      <div className="h-full flex flex-col justify-between overflow-hidden">
        <main className="h-full flex flex-col items-center p-8 overflow-y-auto">
          <h1
            className={`${fontCursive.className} text-4xl text-center mb-6`}
            autoFocus
          >
            <span
              dangerouslySetInnerHTML={{ __html: i18n.t("label_dear_shorter") }}
            />
            {personName}
          </h1>
          <InvitationQR value={qrcodeValue} />
          <div className="mt-6">
            <div className="w-full flex flex-col items-center">
              <div className={`text-center text-base sm:text-lg md:text-xl`}>
                <span>{dateFormatter.format(weddingDate * 1000)}</span>
                {schedules && (
                  <div className="underline underline-offset-2">
                    {schedules.map((s) => (
                      <Fragment key={s.titleKey}>
                        {timeFormatter.formatRange(
                          s.startTime * 1000,
                          s.endTime * 1000,
                        )}{" "}
                        ({i18n.t(s.titleKey)})
                        <br />
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-center mt-6 sm:mt-10">
              <div className="text-center">
                <div className="text-base sm:text-lg md:text-xl">
                  {i18n.t("label_venue_building")}
                </div>
                <div className="text-base mt-1">
                  {i18n.t("label_venue_address_1")}{" "}
                  {i18n.t("label_venue_address_2")}
                </div>
              </div>

              {mapURL && (
                <PrimaryAnchor
                  className="mt-5"
                  target="_blank"
                  href={mapURL}
                  rel="noreferrer nofollow"
                >
                  {i18n.t("label_view_maps")}
                </PrimaryAnchor>
              )}
            </div>
          </div>
        </main>
        <div
          className="backdrop-filter-md flex flex-col justify-between items-center p-2"
          style={{
            boxShadow: "0 25px 25px 25px rgb(0 0 0 / 0.1)",
          }}
        >
          <PrimaryAnchor onClick={() => router.back()}>
            {i18n.t("label_close")}
          </PrimaryAnchor>
        </div>
      </div>
    </dialog>
  );
}
