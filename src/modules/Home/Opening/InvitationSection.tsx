import { useServerI18n } from "@/core/i18n";
import React from "react";
import { AttendeeGreeting } from "./components/AttendeeGreeting";
import { PrimaryLink } from "@/components/Link";
import { OpeningArrowDown } from "./components/OpeningArrowDown";
import { ScrollOpacity } from "@/components/ScrollOpacity";
import config from "@/core/config";

type InvitationSectionProps = {
  invitationURL: string | null;
  containerStyle?: React.CSSProperties;
};

export function InvitationSection(props: InvitationSectionProps) {
  const { invitationURL, containerStyle } = props;
  const i18n = useServerI18n();

  const formatter = new Intl.DateTimeFormat(i18n.getLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="h-screen" style={containerStyle}>
      <div
        id="open-invitation"
        className="flex flex-col h-full justify-end md:pt-24"
      >
        <div className="flex flex-col items-center justify-evenly">
          <div key="block" />
          <div className="flex flex-col items-center">
            <span className="text-xl">
              {formatter.format(config.WEDDING_DAY_TIMESTAMP * 1000)}
            </span>
            <AttendeeGreeting className="mt-11" />
            {invitationURL && (
              <PrimaryLink href={invitationURL} className="text-xl mt-4">
                {i18n.t("label_open_invitation")}
              </PrimaryLink>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center mt-24 pb-4">
          <OpeningArrowDown />
        </div>
        <ScrollOpacity tagID="open-invitation" acceleration={3} />
      </div>

      <div
        className="fixed top-0 bottom-0"
        style={{ zIndex: -1, opacity: 0.3 }}
      >
        <video
          width={4096}
          className="h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/fallback-opening-video.jpeg"
        >
          <source src="/videos/home.webm" type="video/webm" />
          <source src="/videos/home.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
