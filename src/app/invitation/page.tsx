type InvitationProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Invitation(props: InvitationProps) {
  const { searchParams } = props;
  const { rsvp: rsvpToken } = searchParams;

  return <main>Building...</main>;
}
