import { getEventCardViewModel } from "@/modules/RSVP/server";
import { EventCardClient } from "./EventCardClient";
import { redirect } from "next/navigation";

type EventCardPageProps = {};

export default async function EventCardPage(_: EventCardPageProps) {
  const eventCardViewModel = await getEventCardViewModel();

  if (eventCardViewModel.redirectTo != null) {
    redirect(eventCardViewModel.redirectTo);
  }

  const { personName, qrcodeValue } = eventCardViewModel;

  return <EventCardClient personName={personName} qrcodeValue={qrcodeValue} />;
}
