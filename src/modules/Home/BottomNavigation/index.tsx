"use client";
import IcHome from "@material-ui/icons/HomeOutlined";
import IcRSVP from "@material-ui/icons/InsertInvitationOutlined";
import IcShare from "@material-ui/icons/ShareOutlined";
import IcWishes from "@material-ui/icons/SendRounded";
import { ReactNode, memo, useContext } from "react";
import { MusicPlayer, useSharing } from "../index";
import { DisableScrollContext } from "@/components/DisableScroll/context";
import { useI18n } from "@/core/i18n";
import { RSVPContext, RSVPMode } from "@/modules/RSVP";

type BottomNavigationProps = {};

function _BottomNavigation(_: BottomNavigationProps) {
  const rsvp = useContext(RSVPContext);
  const { enableScroll } = useContext(DisableScrollContext);

  const i18n = useI18n();

  const url = typeof window !== "undefined" ? window.location.origin : "";
  const handleSharing = useSharing({
    title: document.title,
    text: document.title,
    url,
  });

  return (
    <div
      id="bottom-navigation"
      className="fixed bottom-4 z-10 shadow w-4/5 left-1/2 -translate-x-1/2 rounded-xl backdrop-blur-md md:w-16 md:bottom-1/2 md:translate-y-1/2 md:left-full md:-ml-10 md:h-1/3"
      style={{
        background: "rgba(var(--background-dialog))",
      }}
    >
      <div id="tabs" className="flex justify-between md:flex-col h-full w-full">
        <TabItem>
          <a
            href="#home"
            className="flex-1 pt-2 pb-1 md:pt-0 md:pb-0"
            onClick={enableScroll}
          >
            <IcHome className="inline-block mb-1" />
            <span className="tab block text-xs">{i18n.t("label_home")}</span>
          </a>
        </TabItem>

        {rsvp.rsvpMode === RSVPMode.FULL ? (
          <TabItem>
            <a
              href="#wishes"
              className="flex-1 pt-2 pb-1 md:pt-0 md:pb-0"
              onClick={enableScroll}
            >
              <IcRSVP className="inline-block mb-1" />
              <span className="tab block text-xs">
                {i18n.t("label_fill_rsvp")}
              </span>
            </a>
          </TabItem>
        ) : null}

        {rsvp.rsvpMode === RSVPMode.BLESSING ? (
          <TabItem>
            <a
              href="#wishes"
              className="flex-1 pt-2 pb-1 md:pt-0 md:pb-0"
              onClick={enableScroll}
            >
              <IcWishes className="inline-block mb-1 -rotate-12" />
              <span className="tab block text-xs">
                {i18n.t("label_fill_rsvp")}
              </span>
            </a>
          </TabItem>
        ) : null}

        <TabItem>
          <div className="flex-1 pt-2 md:pt-0 md:pb-0">
            <MusicPlayer />
            <span className="tab block text-xs">
              {i18n.t("label_music_title")}
            </span>
          </div>
        </TabItem>

        <TabItem>
          <div
            className="flex-1 pt-2 pb-1 md:pt-0 md:pb-0"
            onClick={handleSharing}
          >
            <IcShare className="inline-block mb-1" />
            <span className="tab block text-xs">{i18n.t("label_share")}</span>
          </div>
        </TabItem>
      </div>
    </div>
  );
}

function TabItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full focus:text-teal-500 hover:text-teal-500 flex items-center justify-center text-center">
      {children}
    </div>
  );
}

export const BottomNavigation = memo(_BottomNavigation);
