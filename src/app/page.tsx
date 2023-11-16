import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import {
  RSVPContextProvider,
  useRSVPManagerContextValue,
} from "@/modules/RSVP";
import {
  OpeningSection,
  Navbar,
  QuranSection,
  Footer,
  LoveGiftSection,
  BrideGroomSection,
} from "@/modules/Home";
import { redirect } from "next/navigation";

type HomeProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Home(props: HomeProps) {
  const { searchParams } = props;
  const { rsvp: rsvpToken } = searchParams;

  const rsvpContextValue = await useRSVPManagerContextValue(rsvpToken);

  // remove rsvpToken from URL if it's invalid
  // redirect to home page
  if (rsvpToken && !rsvpContextValue.isValidRSVP) {
    redirect("/");
  }

  return (
    <RSVPContextProvider value={rsvpContextValue}>
      <main>
        <Navbar />
        <OpeningSection rsvpToken={rsvpToken} />
        <QuranSection />
        <BrideGroomSection />
        <LoveGiftSection />
        <Footer />
      </main>
      <AnchorTagSmoothScroll />
    </RSVPContextProvider>
  );
}
