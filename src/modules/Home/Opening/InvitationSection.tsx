import { useServerI18n } from "@/core/i18n";
import React from "react";
import { AttendeeGreeting } from "./components/AttendeeGreeting";
import { ScrollOpacity } from "@/components/ScrollOpacity";
import config from "@/core/config";
import { VideoAutoPlay } from "./components/VideoAutoPlay";
import { OpenInvitationButton } from "./components/OpenInvitationButton";
import { OpenEventCardButton } from "./components/OpenEventCardButton";

type InvitationSectionProps = {
  displayEventCard: boolean;
  containerStyle?: React.CSSProperties;
};

export function InvitationSection(props: InvitationSectionProps) {
  const { containerStyle, displayEventCard } = props;
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
          </div>
          <div className="mt-6">
            <OpenInvitationButton />
          </div>
          {Boolean(displayEventCard) && (
            <div className="mt-6">
              <OpenEventCardButton />
            </div>
          )}
        </div>

        <ScrollOpacity tagID="open-invitation" acceleration={3} />
      </div>

      <div
        className="fixed top-0 bottom-0"
        style={{ zIndex: -1, opacity: 0.3 }}
      >
        <video
          id="home-video"
          width={4096}
          className="h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/images/fallback-opening-video.jpeg"
        >
          <source src="/assets/videos/home-1.webm" type="video/webm" />
          <source src="/assets/videos/home-2.mp4" type="video/mp4" />
        </video>
        <VideoAutoPlay />
      </div>
    </section>
  );
}
