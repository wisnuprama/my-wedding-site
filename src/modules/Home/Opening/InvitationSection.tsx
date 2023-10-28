import { useServerI18n } from "@/core/i18n";
import React from "react";
import { AttendeeGreeting } from "./AttendeeGreeting";
import Image from "next/image";
import Link from "next/link";
import { PrimaryLink } from "@/components/Link";
import { NAVBAR_HEIGHT } from "@/modules/Navbar";

export function InvitationSection(props: { invitationURL: string }) {
  const { invitationURL } = props;
  const i18n = useServerI18n();

  return (
    <section style={{ height: `calc(100vh/2 - ${NAVBAR_HEIGHT}px)` }}>
      <div className="flex flex-col h-full justify-between md:pt-24">
        <div className="flex flex-col items-center justify-evenly">
          <div key="block" />
          <div className="flex flex-col items-center">
            <span className="text-xl">{i18n.t("label_wedding_date")}</span>
            <AttendeeGreeting className="mt-11" />
            <PrimaryLink href={invitationURL}>
              {i18n.t("label_open_invitation")}
            </PrimaryLink>
          </div>
        </div>

        <div className="flex flex-col items-center pb-4">
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
    </section>
  );
}
