import Image from "next/image";
import { RSVP } from "@/components/RSVP";
import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
import { MobileFadeOut } from "@/components/FadeOut";

function Hero() {
  return (
    <div className="p-16 lg:pl-24 2xl:pl-40 xs:pt-40">
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
      <div
        className={`flex max-lg:flex-1 lg:w-2/5  flex-col overflow-auto snap-y z-10 relative`}
      >
        {props.left}
      </div>
      <div className="absolute top-0 bottom-0 left-0 right-0 z-0 md:relative md:opacity-100 md:flex max-lg:flex-1 lg:w-4/6">
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
      <div className="absolute top-0 bottom-0 left-0 right-0 z-0 md:relative md:opacity-100 md:flex max-lg:flex-1 lg:w-4/6">
        {props.left}
      </div>
      <div
        className={`flex max-lg:flex-1 lg:w-2/5  flex-col overflow-auto snap-y z-10`}
      >
        {props.right}
      </div>
    </div>
  );
}

type HomeProps = {
  searchParams: {
    rsvp?: string;
  };
};

export default function Home(props: HomeProps) {
  const { searchParams } = props;
  const { rsvp = "test23" } = searchParams;

  return (
    <main>
      <AnchorTagSmoothScroll />
      <SectionLeftRightLayout
        left={<Hero />}
        right={
          <MobileFadeOut className="h-full">
            <video
              width={2048}
              className="h-full object-cover"
              autoPlay
              disablePictureInPicture
              disableRemotePlayback
              loop
              muted
              playsInline
            >
              <source src="/home.webm" type="video/webm" />
              {/* <source src="/home.mp4" type="video/mp4" /> */}
              <Image
                src="/A7405925.jpeg"
                alt="Your browser does not support the video tag."
                width={2048}
                height={1639}
                className={"object-cover h-full"}
              />
            </video>
          </MobileFadeOut>
        }
      />
      {rsvp && (
        <SectionRightLeftLayout
          left={
            <MobileFadeOut className="h-full">
              <Image
                src="/A7400382.jpeg"
                alt="Photo of Nadia & Wisnu"
                width={2048}
                height={1639}
                className={"object-cover h-full"}
              />
            </MobileFadeOut>
          }
          right={
            <div id="rsvp">
              <RSVP rsvpCode={rsvp} invitationCode="test123" />
            </div>
          }
        />
      )}
    </main>
  );
}
