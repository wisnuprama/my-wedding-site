import { useRSVPManagerContextValue } from "@/modules/RSVP";

type InvitationProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Invitation(props: InvitationProps) {
  const { searchParams } = props;
  const { rsvp: rsvpToken } = searchParams;

  const _ = await useRSVPManagerContextValue(rsvpToken);

  return <main>Building...</main>;
}
