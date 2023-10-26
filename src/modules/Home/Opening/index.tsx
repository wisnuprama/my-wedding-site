import React from "react";

export function OpeningSection() {
  return (
    <div className="h-full">
      <div className="pt-12 flex justify-center md:justify-start md:p-16 md:pt-24">
        <h1 className="text-4xl lg:text-6xl font-bold">
          The Wedding of
          <br />
          <span className="ml-12 lg:ml-24" style={{ lineHeight: 1.5 }}>
            Nadia & Wisnu
          </span>
        </h1>
      </div>
      <div
        className="absolute top-0 bottom-0"
        style={{ zIndex: -1, opacity: 0.3 }}
      >
        <video
          width={2048}
          className="h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/fallback-opening-video.jpeg"
        >
          <source src="/home.webm" type="video/webm" />
          <source src="/home.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
