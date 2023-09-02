import Image from "next/image";
import { RSVP } from "@/components/RSVP";
import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";

function Hero() {
  return (
    <div className="px-24 pt-40">
      <h1 className="text-6xl font-bold mb-24">The Wedding</h1>
      <h2 className="text-4xl font-medium mb-8 md:mb-36">Nadia & Wisnu</h2>
      <p className="text-2xl font-medium">Place | 2024-07-06</p>
    </div>
  );
}

function SectionLeftRightLayout(props: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row p-0 relative md:max-h-screen md:overflow-hidden md:justify-between">
      <div className={`flex md:w-5/12 flex-col overflow-auto snap-y z-10`}>
        {props.left}
      </div>
      <div className="absolute top-0 bottom-0 left-0 right-0 z-0 opacity-30 md:relative md:opacity-100 md:flex md:w-7/12">
        {props.right}
      </div>
    </div>
  );
}

function SectionRightLeftLayout(props: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row p-0 relative md:max-h-screen md:overflow-hidden md:justify-between">
      <div className="absolute top-0 bottom-0 left-0 right-0 z-0 opacity-30 md:relative md:opacity-100 md:flex md:w-7/12">
        {props.left}
      </div>
      <div className={`flex md:w-5/12 flex-col overflow-auto snap-y z-10`}>
        {props.right}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <AnchorTagSmoothScroll />
      <SectionLeftRightLayout
        left={
          <>
            <Hero />
            <div className="flex flex-1 px-24 pt-40 justify-center">
              <a href="#rsvp">{`>> RSVP here <<`}</a>
            </div>
          </>
        }
        right={
          <Image
            src="/A7400382.jpg"
            alt="Photo of Nadia & Wisnu"
            width={2048}
            height={1639}
            className="object-cover"
            priority
            style={{ height: "100%" }}
          />
        }
      />
      <SectionRightLeftLayout
        left={
          <Image
            src="/A7400056.jpg"
            alt="Photo of Nadia & Wisnu"
            width={2048}
            height={1639}
            className="object-cover"
            priority
            style={{ height: "100%" }}
          />
        }
        right={
          <div id="rsvp">
            <RSVP />
          </div>
        }
      />
    </main>
  );
}
