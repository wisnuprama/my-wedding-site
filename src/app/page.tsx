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
  HomeDisableScrollContainer,
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
      <HomeDisableScrollContainer>
        <Navbar />
        <main>
          <OpeningSection rsvpToken={rsvpToken} />
          <QuranSection />
          <BrideGroomSection />
          <LoveGiftSection />
        </main>
        <Footer />
        <AnchorTagSmoothScroll />
      </HomeDisableScrollContainer>
    </RSVPContextProvider>
  );
}
