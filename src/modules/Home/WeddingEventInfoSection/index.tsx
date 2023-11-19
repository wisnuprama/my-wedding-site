import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { EventTimeInfo } from "./components/EventTimeInfo";
import config from "@/core/config";
import { PrimaryAnchor } from "@/components/Link";

export type WeddingEventInfoSectionProps = {};

export function WeddingEventInfoSection(_: WeddingEventInfoSectionProps) {
  const i18n = useServerI18n();

  const schedules = config.SCHEDULES;
  const mapURL = config.VENUE_MAP_URL;
  const calendarURL = config.CALENDAR_URL;

  return (
    <section className="min-h-screen px-8 py-14 flex flex-col items-center justify-between">
      {schedules?.length ? (
        <div className="w-full flex flex-col items-center">
          {schedules.map((s, index) => (
            <div
              key={s.titleKey}
              id={s.titleKey}
              className={index < schedules.length - 1 ? "mb-14" : undefined}
            >
              <h1
                className={`text-4xl sm:text-5xl ${fontCursive.className} text-center`}
              >
                {i18n.t(s.titleKey)}
              </h1>
              <EventTimeInfo
                containerClassName="mt-4"
                startTime={s.startTime}
                endTime={s.endTime}
              />
            </div>
          ))}

          {calendarURL && (
            <PrimaryAnchor
              className="mt-8 text-lg"
              target="_blank"
              rel="noreferrer nofollow"
              href={calendarURL}
            >
              {i18n.t("label_event_save_the_date")}
            </PrimaryAnchor>
          )}
        </div>
      ) : null}

      <div className="text-center mt-14 w-full flex flex-col items-center">
        <div>
          <p className="text-xl uppercase">{i18n.t("label_venue_building")}</p>
          <p className="text-base mt-1">
            {i18n.t("label_venue_address_1")} {i18n.t("label_venue_address_2")}
          </p>
        </div>

        {mapURL && (
          <PrimaryAnchor
            className="mt-5 text-lg"
            target="_blank"
            href={mapURL}
            rel="noreferrer nofollow"
          >
            {i18n.t("label_view_maps")}
          </PrimaryAnchor>
        )}
      </div>
    </section>
  );
}
