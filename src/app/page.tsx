import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import {
  RSVPContextProvider,
  useRSVPManagerContextValue,
} from "@/modules/RSVP";
import { OpeningSection } from "@/modules/Home";
import { Navbar } from "@/modules/Home/Navbar";
import { QuranSection } from "@/modules/Home/QuranSection";
import { Footer } from "@/modules/Home/Footer";

type HomeProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Home(props: HomeProps) {
  const { searchParams } = props;
  const { rsvp: rsvpToken } = searchParams;

  const rsvpContextValue = await useRSVPManagerContextValue(rsvpToken);

  return (
    <RSVPContextProvider value={rsvpContextValue}>
      <main>
        <Navbar />
        <OpeningSection rsvpToken={rsvpToken} />
        <QuranSection />
        <section id="pg-3" className="h-screen"></section>
        <Footer />
      </main>
      <AnchorTagSmoothScroll />
    </RSVPContextProvider>
  );
}
