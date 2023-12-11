"use client";

import { useI18n } from "@/core/i18n";
import { RSVPContext } from "@/modules/RSVP";
import { memo, useContext } from "react";

type AttendeeGreetingProps = {
  className?: string;
};

function InnerAttendeeGreeting(props: AttendeeGreetingProps) {
  const { className } = props;
  const rsvp = useContext(RSVPContext);
  const i18n = useI18n();

  if (!rsvp.isValidRSVP) {
    return null;
  }

  return (
    <div className={["text-xl sm:text-2xl text-center", className].join(" ")}>
      <span dangerouslySetInnerHTML={{ __html: i18n.t("label_dear") }} />
      {rsvp.data.name},
    </div>
  );
}

export const AttendeeGreeting = memo(InnerAttendeeGreeting);
