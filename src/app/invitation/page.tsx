import { useRSVPManagerContextValue } from "@/modules/RSVP";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 */
export const runtime = "edge";

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
