import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import {
  RSVPContextProvider,
  useRSVPManagerContextValue,
} from "@/modules/RSVP";
import { OpeningSection } from "@/modules/Home";

/**
 * We are using cloudflare so, set this to edge
 * https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes#segment-runtime-option
 */
export const runtime = "edge";

type HomeProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default async function Home(props: HomeProps) {
  const { searchParams } = props;
  const { rsvp } = searchParams;

  const rsvpContextValue = await useRSVPManagerContextValue(rsvp);

  return (
    <RSVPContextProvider value={rsvpContextValue}>
      <main>
        <AnchorTagSmoothScroll />
        <section id="pg-1" className="h-screen">
          <OpeningSection />
        </section>
        <section id="pg-2" className="h-screen">
          <OpeningSection />
        </section>
        <section id="pg-3" className="h-screen">
          <OpeningSection />
        </section>
        <section id="pg-4" className="h-screen">
          <OpeningSection />
        </section>
      </main>
    </RSVPContextProvider>
  );
}
