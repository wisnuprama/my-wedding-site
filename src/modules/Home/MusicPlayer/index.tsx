"use client";

import IcMusic from "@material-ui/icons/MusicNote";
import IcArrowLeft from "@material-ui/icons/ArrowLeft";
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
        console.log("scrollY", scrollY, prevStopScrollPosition.current);
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

  const IcArrow = isHiding ? <IcMusic /> : <IcArrowLeft fontSize="large" />;

  return (
    <div
      id="music-container"
      className="fixed bottom-0 flex"
      style={containerStyle}
    >
      <iframe
        className="rounded-md"
        src="https://open.spotify.com/embed/playlist/3nTWE0ZIJ7vmCMz0URQ6gQ?utm_source=generator"
        height={100}
        width={MUSIC_PLAYER_WIDTH}
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
      />
      <button
        onClick={() => startTransition(() => setHideState((s) => !s))}
        className="backdrop-blur-sm rounded-md h-10 w-8 text-right"
        style={{ background: "rgb(72,76,68)", marginLeft: -12, zIndex: -1 }}
      >
        {IcArrow}
      </button>
    </div>
  );
}

export const MusicPlayer = memo(_MusicPlayer);
