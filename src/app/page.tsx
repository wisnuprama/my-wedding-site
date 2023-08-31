import Image from "next/image";
import { RSVP } from "@/components/RSVP";
import { AnchorTagSmoothScroll } from "@/components/AnchorTagSmoothScroll";
// import { useLayoutEffect } from "react";

function Hero() {
  return (
    <div className="px-24 pt-40">
      <h1 className="text-6xl font-bold mb-24">The Wedding</h1>
      <h2 className="text-4xl font-medium mb-36">
        Nadia Rizqi Aziza &
        <br />Wisnu Pramadhitya Ramadhan
      </h2>
      <p className="text-2xl font-medium">
        Place | 2024-07-06
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <AnchorTagSmoothScroll />
      <div className="flex min-h-screen max-h-screen flex-row justify-between p-0 overflow-hidden">
        <div className="flex w-5/12 flex-col overflow-auto snap-y">
          <Hero />
          <div className="flex flex-1 px-24 pt-40 justify-center">
            <a href="#rsvp">{`>> RSVP here<<`}</a>
          </div>
        </div>
        <div className="flex w-7/12">
          <Image
            src="/A7400382.jpg"
            alt="Photo of Nadia & Wisnu"
            width={2048}
            height={1639}
            className="object-cover"
            priority
            style={{ height: "100%" }}
          />
        </div>
      </div>
      <div className="flex min-h-screen max-h-screen flex-row justify-between p-0 overflow-hidden">
        <div className="flex w-7/12">
          <Image
            src="/A7400056.jpg"
            alt="Photo of Nadia & Wisnu"
            width={2048}
            height={1639}
            className="object-cover"
            priority
            style={{ height: "100%" }}
          />
        </div>
        <div id="rsvp" className="flex w-5/12 flex-col overflow-auto snap-y">
          <RSVP />
        </div>
      </div>
    </main>
  );
}
