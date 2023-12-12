"use client";

import IcMusic from "@material-ui/icons/MusicNote";
import IcClose from "@material-ui/icons/Close";
import {
  CSSProperties,
  memo,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import debounce from "lodash.debounce";

import "./index.css";
import config from "@/core/config";

const MUSIC_PLAYER_WIDTH = 320;
const SCROLL_THRESHOLD = 100;

function _MusicPlayer() {
  const [_, startTransition] = useTransition();
  const [isHiding, setHideState] = useState(false);

  const prevStopScrollPosition = useRef(0);
  useLayoutEffect(() => {
    const handleScroll = debounce(
      () => {
        const { scrollY } = window;
        const isScrolling =
          Math.abs(prevStopScrollPosition.current - scrollY) > SCROLL_THRESHOLD;

        if (isScrolling) {
          prevStopScrollPosition.current = scrollY;
          startTransition(() => {
            setHideState(isScrolling);
          });
        }
      },
      100,
      { leading: false, trailing: true },
    );

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const containerStyle: CSSProperties = {};
  if (isHiding) {
    containerStyle["left"] = -MUSIC_PLAYER_WIDTH;
  }

  const IcArrow = isHiding ? (
    <IcMusic />
  ) : (
    <IcClose fontSize="small" style={{ marginTop: -3 }} />
  );

  return (
    <div
      id="music-container"
      className="fixed bottom-0 flex"
      style={containerStyle}
    >
      {/* <iframe
        className="rounded-md"
        src={config.SPOTIFY_URL}
        height={100}
        width={MUSIC_PLAYER_WIDTH}
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
      /> */}
      <audio
        controls
        src="/assets/audios/home.mp3"
        playsInline
        preload="auto"
      />
      <button
        onClick={() => startTransition(() => setHideState((s) => !s))}
        className="backdrop-blur-sm rounded-md h-10 w-8 text-right"
        style={{
          background: "rgb(72,76,68)",
          marginLeft: 12,
          zIndex: -1,
          color: "rgba(var(--primary-color))",
        }}
      >
        {IcArrow}
      </button>
    </div>
  );
}

export const MusicPlayer = memo(_MusicPlayer);
