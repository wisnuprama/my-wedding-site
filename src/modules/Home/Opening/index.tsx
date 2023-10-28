import { useServerI18n } from "@/core/i18n";
import React from "react";
import { AttendeeGreeting } from "./AttendeeGreeting";
import Image from "next/image";
import Link from "next/link";
import { PrimaryLink } from "@/components/Link";

export type OpeningSectionProps = {
  rsvpToken: string | null | undefined;
};

export function OpeningSection(props: OpeningSectionProps) {
  const { rsvpToken } = props;

  const i18n = useServerI18n();

  const invitationURL = (() => {
    if (!rsvpToken) return "/invitation";
    return "/invitation?rsvp=" + rsvpToken;
  })();

  return (
    <div className="h-full">
      <div className="flex flex-col h-full justify-between md:justify-start p-8 pt-12 md:p-16 md:pt-24">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
          The Wedding of
          <br />
          <span className="ml-12 lg:ml-24" style={{ lineHeight: 1.5 }}>
            Nadia & Wisnu
          </span>
        </h1>

        <div className="flex flex-col items-center flex-1 justify-evenly">
          <div key="block" />
          <div className="flex flex-col items-center">
            <span className="text-xl">{i18n.t("label_wedding_date")}</span>
            <AttendeeGreeting className="mt-11" />
            <PrimaryLink href={invitationURL}>
              {i18n.t("label_open_invitation")}
            </PrimaryLink>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Link href="#pg-2">
            <Image
              src="/images/ic_arrow_down.png"
              alt="Go to next section"
              width={48}
              height={30}
              className="object-cover drop-shadow pointer-events-none"
              priority
            />
          </Link>
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0"
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
    </div>
  );
}
