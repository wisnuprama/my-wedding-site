"use client";

import IcPlay from "@material-ui/icons/PlayArrow";
import IcStop from "@material-ui/icons/Stop";
import {
  RefObject,
  memo,
  startTransition,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";

import "./index.css";
import invariant from "invariant";
import Image from "next/image";
import { IcButton } from "@/components/Link";
import config from "@/core/config";
import * as Sentry from "@sentry/nextjs";

const PlayerBtn = memo(function _PlayerBtn(props: {
  audioPlayer: RefObject<HTMLAudioElement>;
  onStartPlay?: () => void;
}) {
  const { audioPlayer, onStartPlay } = props;
  const [__, forceRender] = useReducer((s) => s + 1, 0);

  const handlePlay = useCallback(() => {
    invariant(audioPlayer.current, "Must render audio player before start");

    const player = audioPlayer.current;

    if (!player.paused) {
      return;
    }

    player.volume = config.MUSIC_MAX_VOLUME ?? 1;

    (async () => {
      try {
        await player.play();
      } catch (e: any) {
        Sentry.captureException(e, {
          tags: { userJourney: "music", actionRequired: "investigation" },
        });
      }
    })();

    setTimeout(() => {
      onStartPlay &&
        startTransition(() => {
          onStartPlay();
        });
    }, 1000);
  }, [audioPlayer, onStartPlay]);

  const handlePlayButton = useCallback(() => {
    invariant(audioPlayer.current, "Must render audio player before start");

    const player = audioPlayer.current;

    if (player.paused) {
      handlePlay();
    } else {
      player.pause();
    }

    forceRender();
  }, [audioPlayer, handlePlay]);

  // effect handling play event
  // need to re-render
  useLayoutEffect(() => {
    const player = audioPlayer.current;
    if (!player) {
      return;
    }

    player.addEventListener("play", forceRender);

    return () => {
      player.removeEventListener("play", forceRender);
    };
  }, [audioPlayer]);

  // effect handling auto play
  const once = useRef(false);
  useLayoutEffect(() => {
    function handler() {
      if (once.current) {
        return;
      }

      once.current = true;
      handlePlay();
    }

    window.addEventListener("click", handler, { passive: true, once: true });
    window.addEventListener("touchstart", handler, {
      passive: true,
      once: true,
    });

    return () => {
      // remove in case
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [handlePlay]);

  const IcPlayer =
    audioPlayer.current == null || audioPlayer.current.paused ? (
      <IcPlay fontSize="small" />
    ) : (
      <IcStop fontSize="small" />
    );

  return (
    <div className="flex items-center justify-center">
      <IcButton
        onClick={handlePlayButton}
        className={`text-right h-auto w-auto relative rounded-full ${
          audioPlayer.current?.paused ? "" : "rounded-none"
        } hover:rounded-none overflow-hidden`}
        style={{
          transition: "all .3s ease-in-out",
        }}
      >
        {IcPlayer}
        <Image
          src="/assets/images/home-mp3.jpg"
          alt="Album cover of NÉO–ROMANCE"
          width={40}
          height={40}
          priority
          className="h-full w-full absolute opacity-50 left-0 right-0 top-0 bottom-0 -z-10 rounded-sm"
        />
      </IcButton>
    </div>
  );
});

const SCROLL_THRESHOLD = 100;

function _MusicPlayer() {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerBtnContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      id="music-container"
      // className="fixed bottom-3 flex backdrop-blur-md rounded-md pr-1 shadow-sm"
    >
      <audio
        ref={audioPlayerRef}
        src="/assets/audios/home.mp3"
        playsInline
        loop
        preload="auto"
      />
      <div className="flex">
        {/* <div className="px-1">
          <div className="text-sm">New Romance</div>
          <div className="text-xs"> by Alexandra Stréliski</div>
        </div> */}
      </div>
      <div ref={playerBtnContainerRef} className="relative">
        {/* <a
          href="https://open.spotify.com/track/0LGbC0S4fcUIcaEk08Hc8r?si=cd7fb27c19d74ce7"
          target="_blank"
          rel="noreferrer"
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"
          style={{
            height: 64,
            width: 64,
          }}
        >
          <Image
            src="/assets/images/home-mp3.jpg"
            alt="Album cover of NÉO–ROMANCE"
            width={40}
            height={40}
            className="h-full w-full rounded-md"
          />
        </a> */}
        <PlayerBtn audioPlayer={audioPlayerRef} />
      </div>
    </div>
  );
}

export const MusicPlayer = memo(_MusicPlayer);
