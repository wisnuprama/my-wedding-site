"use client";
import IcHome from "@material-ui/icons/Home";
import IcCalendar from "@material-ui/icons/InsertInvitation";
import IcShare from "@material-ui/icons/Share";
import IcWishes from "@material-ui/icons/SendRounded";
import { ReactNode, memo, useContext } from "react";
import { MusicPlayer, useSharing } from "../index";
import { RSVPContext, RSVPMode } from "@/modules/RSVP";
import Link from "next/link";

import "./index.css";

type BottomNavigationProps = {};

function _BottomNavigation(_: BottomNavigationProps) {
  const rsvp = useContext(RSVPContext);

  const handleSharing = useSharing(() => ({
    title: document.title,
    text: document.title,
    url: window.location.origin,
  }));

  function renderRSVPTabItem() {
    switch (rsvp.rsvpMode) {
      case RSVPMode.FILLED_ATTEND:
        return (
          <TabItem>
            <Link
              href="/event-card"
              className="flex-1 h-full pt-2 pb-1 md:pt-0 md:pb-0 flex justify-center items-center"
            >
              <svg height={24} viewBox="0 -960 960 960" width={24}>
                <path d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z" />
              </svg>
            </Link>
          </TabItem>
        );

      case RSVPMode.ELIGIBLE:
        return (
          <>
            <TabItem>
              <a
                href="#event-info"
                className="flex-1 h-full pt-2 pb-1 md:pt-0 md:pb-0 flex justify-center items-center"
              >
                <IcCalendar className="inline-block mb-1" />
              </a>
            </TabItem>
            <TabItem>
              <a
                href="#wishes"
                className="flex-1 h-full pt-2 pb-1 md:pt-0 md:pb-0 flex justify-center items-center"
              >
                <svg height={24} viewBox="0 -960 960 960" width={24}>
                  <path d="M40-360v-240h140q25 0 42.5 17.5T240-540v40q0 18-10.5 33T204-444l36 84h-60l-34-80h-46v80H40Zm240 0v-60h120v-30h-80q-17 0-28.5-11.5T280-490v-70q0-17 11.5-28.5T320-600h140v60H340v30h80q17 0 28.5 11.5T460-470v70q0 17-11.5 28.5T420-360H280Zm290 0-70-240h60l40 137 40-137h60l-70 240h-60Zm150 0v-240h140q25 0 42.5 17.5T920-540v40q0 25-17.5 42.5T860-440h-80v80h-60ZM100-500h80v-40h-80v40Zm680 0h80v-40h-80v40Z" />
                </svg>
              </a>
            </TabItem>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div
      id="bottom-navigation"
      className={`z-10 shadow w-4/5 rounded-xl backdrop-blur-md sticky bottom-4 left-[10%]
      md:fixed md:w-12 md:bottom-1/2 md:translate-y-1/2 md:-translate-x-1/2 md:left-full md:-ml-10 md:h-1/3`}
      style={{
        background: "rgba(var(--background-dialog))",
      }}
    >
      <div id="tabs" className="flex justify-between md:flex-col h-full w-full">
        <TabItem>
          <a
            href="#home"
            className="flex-1 h-full pt-2 pb-1 md:pt-0 md:pb-0 flex justify-center items-center"
          >
            <IcHome className="inline-block mb-1" />
          </a>
        </TabItem>

        {renderRSVPTabItem()}

        {rsvp.rsvpMode === RSVPMode.BLESSING ? (
          <TabItem>
            <a
              href="#wishes"
              className="flex-1 h-full pt-2 pb-1 md:pt-0 md:pb-0 flex justify-center items-center"
            >
              <IcWishes className="inline-block mb-1 -rotate-12" />
            </a>
          </TabItem>
        ) : null}

        <TabItem>
          <div className="flex-1 h-full pt-1.5 md:pt-0 md:pb-0 flex justify-center items-center">
            <MusicPlayer />
          </div>
        </TabItem>

        <TabItem>
          <div
            className="flex-1 h-full pt-2 pb-1 md:pt-0 md:pb-0 flex justify-center items-center cursor-pointer"
            onClick={handleSharing}
          >
            <IcShare className="inline-block mb-1" />
          </div>
        </TabItem>
      </div>
    </div>
  );
}

function TabItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center text-center">
      {children}
    </div>
  );
}

export const BottomNavigation = memo(_BottomNavigation);
