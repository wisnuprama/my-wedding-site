import { useServerI18n } from "@/core/i18n";
import React from "react";
import { AttendeeGreeting } from "./components/AttendeeGreeting";
import { PrimaryLink } from "@/components/Link";
import { ArrowDownToNextSection } from "./components/ArrowDown";
import { ScrollOpacity } from "../../ScrollOpacity";

type InvitationSectionProps = {
  invitationURL: string;
  containerStyle?: React.CSSProperties;
};

export function InvitationSection(props: InvitationSectionProps) {
  const { invitationURL, containerStyle } = props;
  const i18n = useServerI18n();

  return (
    <section className="h-screen" style={containerStyle}>
      <div
        id="open-invitation"
        className="flex flex-col h-full justify-end md:pt-24"
      >
        <div className="flex flex-col items-center justify-evenly">
          <div key="block" />
          <div className="flex flex-col items-center">
            <span className="text-xl">{i18n.t("label_wedding_date")}</span>
            <AttendeeGreeting className="mt-11" />
            <PrimaryLink href={invitationURL} className="text-xl mt-4">
              {i18n.t("label_open_invitation")}
            </PrimaryLink>
          </div>
        </div>

        <div className="flex flex-col items-center mt-24 pb-4">
          <ArrowDownToNextSection />
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
          <source src="/home.webm" type="video/webm" />
          <source src="/home.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
