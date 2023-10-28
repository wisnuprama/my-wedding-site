import React from "react";
import { fontCursive } from "@/core/styles";
import { CountdownSection } from "./CountdownSection";
import { InvitationSection } from "./InvitationSection";

export type OpeningSectionProps = {
  rsvpToken: string | null | undefined;
};

export function OpeningSection(props: OpeningSectionProps) {
  const { rsvpToken } = props;

  const invitationURL = (() => {
    if (!rsvpToken) return "/invitation";
    return "/invitation?rsvp=" + rsvpToken;
  })();

  return (
    <div className="m-0">
      <div
        className="px-8 md:px-16 md:pt-24 sticky top-10 md:top-24 z-10 flex justify-center"
        style={{ height: "calc(100vh/2)" }}
      >
        <h1
          className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className}`}
        >
          The Wedding of
          <br />
          <span className="ml-16 lg:ml-24" style={{ lineHeight: 1.5 }}>
            Nadia & Wisnu
          </span>
        </h1>
      </div>
      <InvitationSection invitationURL={invitationURL} />
      <CountdownSection />
    </div>
  );
}
