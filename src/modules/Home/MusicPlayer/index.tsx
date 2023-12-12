"use client";

import IcMusic from "@material-ui/icons/MusicNote";
import IcPlay from "@material-ui/icons/PlayArrow";
import IcStop from "@material-ui/icons/Stop";
import {
  CSSProperties,
  RefObject,
  memo,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import debounce from "lodash.debounce";

import "./index.css";
import invariant from "invariant";
import Image from "next/image";
import { IcButton } from "@/components/Link";

const PlayerBtn = memo(function _PlayerBtn(props: {
  audioPlayer: RefObject<HTMLAudioElement>;
}) {
  const { audioPlayer } = props;
  const [__, forceRender] = useReducer((s) => s + 1, 0);

  const handlePlay = useCallback(() => {
    invariant(audioPlayer.current, "Must render audio player before start");

    const player = audioPlayer.current;

    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }

    forceRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const IcPlayer =
    audioPlayer.current == null || audioPlayer.current.paused ? (
      <IcPlay />
    ) : (
      <IcStop />
    );

  return (
    <div className="h-full flex items-center justify-center">
      <IcButton onClick={handlePlay} className="text-right h-auto w-auto">
        {IcPlayer}
      </IcButton>
    </div>
  );
});

const SCROLL_THRESHOLD = 100;

function _MusicPlayer() {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerBtnContainerRef = useRef<HTMLDivElement>(null);

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

  const containerStyle: CSSProperties = {
    background: "rgba(var(--background-card))",
  };
  if (isHiding) {
    const btnWidth = playerBtnContainerRef?.current?.offsetWidth ?? 0;
    containerStyle["left"] =
      -(containerRef.current?.offsetWidth ?? 0) + btnWidth;
  }

  return (
    <div
      ref={containerRef}
      id="music-container"
      className="fixed bottom-3 flex backdrop-blur-md rounded-md pr-1 shadow-sm"
      style={containerStyle}
    >
      <audio
        ref={audioPlayerRef}
        src="/assets/audios/home.mp3"
        playsInline
        preload="auto"
      />
      <div className="flex">
        <a
          href="https://open.spotify.com/track/0LGbC0S4fcUIcaEk08Hc8r?si=cd7fb27c19d74ce7"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/assets/assets/images/home-mp3.jpg"
            alt="Album cover of NÉO–ROMANCE"
            width={40}
            height={40}
            style={{ height: 40, width: 40 }}
          />
        </a>
        <div className="px-1">
          <div className="text-sm">New Romance</div>
          <div className="text-xs"> by Alexandra Stréliski</div>
        </div>
      </div>
      <div ref={playerBtnContainerRef}>
        {isHiding ? (
          <button
            onClick={() => setHideState(false)}
            className="h-full flex items-center pl-1"
          >
            <IcMusic />
          </button>
        ) : (
          <PlayerBtn audioPlayer={audioPlayerRef} />
        )}
      </div>
    </div>
  );
}

export const MusicPlayer = memo(_MusicPlayer);
