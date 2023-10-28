import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import {
  RSVPContextProvider,
  useRSVPManagerContextValue,
} from "@/modules/RSVP";
import { OpeningSection } from "@/modules/Home";
import { Navbar } from "@/modules/Navbar";

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
        <section id="pg-1" className="h-screen">
          <OpeningSection rsvpToken={rsvpToken} />
        </section>
        <section id="pg-2" className="h-screen"></section>
        <section id="pg-3" className="h-screen"></section>
        <section id="pg-4" className="h-screen"></section>
      </main>
      <AnchorTagSmoothScroll />
    </RSVPContextProvider>
  );
}
