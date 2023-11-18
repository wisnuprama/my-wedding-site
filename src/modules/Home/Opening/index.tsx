import React from "react";
import { fontCursive } from "@/core/styles";
import { CountdownSection } from "./CountdownSection";
import { InvitationSection } from "./InvitationSection";

export type OpeningSectionProps = {
  rsvpToken: string | null | undefined;
};

export function OpeningSection(props: OpeningSectionProps) {
  const { rsvpToken } = props;

  const invitationURL = (() => {
    if (!rsvpToken) return "/invitation";
    return "/invitation?rsvp=" + rsvpToken;
  })();

  return (
    <div className="m-0">
      <div id="pg-1" className="relative" style={styles.pageOneContainer}>
        <div className="sticky flex justify-center top-10 md:px-16 md:pt-24 md:top-24">
          <h1
            className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className}`}
          >
            The Wedding of
            <br />
            <span className="ml-16 lg:ml-24" style={styles.titleSpanText}>
              Nadia & Wisnu
            </span>
          </h1>
        </div>
        <InvitationSection invitationURL={invitationURL} />
        <div id="pg-2" style={styles.anchorToPage2} />
      </div>
      <div style={styles.pageTwoContainer}>
        <CountdownSection />
      </div>
    </div>
  );
}

/**
 * How big is the space will be used for sticky title.
 * This space will make sure the title will fit into the top of
 * second page when programmatically scrolling to the second page.
 */
const USED_SPACE_FOR_TITLE = 0.25;
const FIRST_SCREEN_RATIO = 1 + USED_SPACE_FOR_TITLE;
const SECOND_PAGE_SCREEN_RATIO = 1 - USED_SPACE_FOR_TITLE;

const styles = {
  titleSpanText: { lineHeight: 1.5 },
  pageOneContainer: {
    /**
     * This is the height of the first page + N% of the second page
     * to include the sticky title
     */
    height: `calc(100vh * ${FIRST_SCREEN_RATIO})`,
  },
  anchorToPage2: {
    zIndex: -1,
    position: "absolute",
    /**
     * This is the height of the first page
     */
    top: "100vh",
  },
  pageTwoContainer: {
    /**
     * The N% space is used for the sticky title
     */
    height: `calc(100vh * ${SECOND_PAGE_SCREEN_RATIO})`,
  },
} as const;
