"use server";
import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import {
  RSVPContextProvider,
  RSVPContextValue,
  getRSVPViewModel,
} from "@/modules/RSVP";
import {
  OpeningSection,
  Navbar,
  QuranSection,
  Footer,
  LoveGiftSection,
  BrideGroomSection,
  HomeDisableScrollContainer,
  WeddingEventInfoSection,
  MusicPlayer,
  RSVPWishesSection,
} from "@/modules/Home";
import { redirect } from "next/navigation";

// TODO: not sure where we should put this
import "./initializer";

type HomeProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Home(props: HomeProps) {
  const { searchParams } = props;
  const { rsvp: rsvpToken } = searchParams;

  const rsvpViewModel = await getRSVPViewModel(rsvpToken);

  // remove rsvpToken from URL if it's invalid
  // redirect to home page
  if (rsvpToken && !rsvpViewModel.isValidRSVP) {
    redirect("/");
  }

  const rsvpContextValue: RSVPContextValue = !rsvpViewModel.isValidRSVP
    ? {
        isValidRSVP: rsvpViewModel.isValidRSVP,
      }
    : {
        isValidRSVP: rsvpViewModel.isValidRSVP,
        data: rsvpViewModel.rsvpUserData,
      };

  return (
    <RSVPContextProvider value={rsvpContextValue}>
      <HomeDisableScrollContainer>
        <Navbar />
        <main>
          <OpeningSection rsvpToken={rsvpToken} />
          <QuranSection />
          <BrideGroomSection />
          <WeddingEventInfoSection />
          <RSVPWishesSection rsvpViewModel={rsvpViewModel} />
          <LoveGiftSection />
          <MusicPlayer />
        </main>
        <Footer />
        <AnchorTagSmoothScroll />
      </HomeDisableScrollContainer>
    </RSVPContextProvider>
  );
}
