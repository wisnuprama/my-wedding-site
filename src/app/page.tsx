"use server";
import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import {
  RSVPClientCookies,
  RSVPContextProvider,
  RSVPContextValue,
} from "@/modules/RSVP";
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
import { redirect } from "next/navigation";

type HomeProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Home(props: HomeProps) {
  const { searchParams } = props;
  const { rsvp } = searchParams;

  const rsvpViewModel = await getRSVPViewModel(rsvp);

  // remove rsvpToken from URL if it's invalid
  // redirect to home page
  if (rsvp && !rsvpViewModel.isValidRSVP) {
    redirect("/");
  }

  const rsvpToken = rsvpViewModel.isValidRSVP
    ? rsvpViewModel.rsvpToken
    : undefined;

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
          <RSVPClientCookies
            isValidToken={rsvpViewModel.isValidRSVP}
            rsvpToken={rsvpToken}
          />
          <OpeningSection isValidRSVP={rsvpViewModel.isValidRSVP} />
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
