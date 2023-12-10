"use server";
import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import { RSVPContextProvider, RSVPContextValue } from "@/modules/RSVP";
import { getRSVPViewModel } from "@/modules/RSVP/server";
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

type HomeProps = {};

export default async function Home(_: HomeProps) {
  const rsvpViewModel = await getRSVPViewModel();

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
          <OpeningSection rsvpViewModel={rsvpViewModel} />
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
