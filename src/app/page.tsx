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
  Sharing,
} from "@/modules/Home";
import { reviewRSVPSession } from "@/modules/RSVP/components/RSVPSessionCookies";

type HomeProps = {
  searchParams: {
    /**
     * RSVP token
     */
    t?: string;
    /**
     * means client must check whether the cookies exist before proceeding to set the cookies again
     */
    c?: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  await reviewRSVPSession(searchParams);

  const rsvpViewModel = await getRSVPViewModel();

  const rsvpContextValue: RSVPContextValue = !rsvpViewModel.isValidRSVP
    ? {
        isValidRSVP: rsvpViewModel.isValidRSVP,
        rsvpMode: rsvpViewModel.rsvpMode,
      }
    : {
        isValidRSVP: rsvpViewModel.isValidRSVP,
        rsvpMode: rsvpViewModel.rsvpMode,
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
          <Sharing />
          <MusicPlayer />
        </main>
        <Footer />
        <AnchorTagSmoothScroll />
      </HomeDisableScrollContainer>
    </RSVPContextProvider>
  );
}
