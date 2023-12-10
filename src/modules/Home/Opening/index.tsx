import React from "react";
import { fontCursive } from "@/core/styles";
import { CountdownSection } from "./CountdownSection";
import { InvitationSection } from "./InvitationSection";
import { NAVBAR_HEIGHT } from "..";
import { useServerI18n } from "@/core/i18n";
import { RSVPViewModel } from "@/modules/RSVP";

export type OpeningSectionProps = {
  rsvpViewModel: RSVPViewModel;
};

export async function OpeningSection(props: OpeningSectionProps) {
  const { rsvpViewModel } = props;
  const i18n = useServerI18n();

  return (
    <div className="m-0">
      <div id="pg-1" className="relative" style={styles.pageOneContainer}>
        <div className="sticky flex justify-center top-10 md:px-16 md:top-24">
          <h1
            className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className}`}
          >
            {i18n.t("title_wedding1")}
            <br />
            <span className="ml-16 lg:ml-24" style={styles.titleSpanText}>
              {i18n.t("title_wedding2")}
            </span>
          </h1>
        </div>
        <InvitationSection
          containerStyle={styles.invitationContainer}
          displayEventCard={
            rsvpViewModel.isValidRSVP &&
            (await rsvpViewModel.shouldDisplayEventCard())
          }
        />
        <div id="pg-2" style={styles.anchorToPage2} />
      </div>
      <CountdownSection
        isValidRSVP={rsvpViewModel.isValidRSVP}
        containerStyle={styles.pageTwoContainer}
      />
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
  invitationContainer: {
    /**
     * Push up from the 25% of the pageOneContainer
     */
    paddingBottom: `calc(100vh * ${
      USED_SPACE_FOR_TITLE + 0.1
    } + ${NAVBAR_HEIGHT}px)`,
  },
  pageTwoContainer: {
    /**
     * The N% space is used for the sticky title
     * Using dvh here for handling browser bottom bar
     */
    height: `calc(100dvh * ${SECOND_PAGE_SCREEN_RATIO})`,
    // paddingBottom: `env(safe-area-inset-bottom)`,
  },
} as const;
