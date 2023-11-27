import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { RSVPViewModel } from "@/modules/RSVP";
import { RSVPWishesForm } from "./RSVPWishesForm";
import { RSVPWishesPagination, WishItem } from "./RSVPWishesPagination";
import { WishRow, WishesSheetModel, sheetdb } from "@/core/data";
import { ReactNode } from "react";
import { deserializeSheetData } from "@/core/data/utils";

export type RSVPWishesSectionProps = {
  rsvpViewModel: RSVPViewModel;
};

export async function RSVPWishesSection(props: RSVPWishesSectionProps) {
  const { rsvpViewModel } = props;

  const i18n = useServerI18n();

  async function getWishes() {
    "use server";

    let rows: WishItem[] = [];
    try {
      rows = (
        await WishesSheetModel.getInstance(
          await sheetdb.getSpreadsheet(),
        ).findAllFromCache()
      )
        .map((row): WishItem => deserializeSheetData(row.toObject() as WishRow))
        .sort((a, b) => b.ctime - a.ctime);
    } catch (e) {
      // TODO: log error
    }

    return JSON.stringify(rows);
  }

  let content: ReactNode = null;

  if (!rsvpViewModel.isValidRSVP) {
    content = <RSVPWishesPagination wishesJSON={await getWishes()} />;
  } else {
    content = (
      <>
        <RSVPWishesForm rsvpViewModel={rsvpViewModel} />
        <RSVPWishesPagination wishesJSON={await getWishes()} />
      </>
    );
  }

  return (
    <section className="min-h-screen px-4 py-24 md:flex md:flex-col">
      <h1
        className={`text-4xl sm:text-5xl ${fontCursive.className} text-center`}
      >
        {i18n.t("title_rsvp_and_wishes")}
      </h1>
      {content}
    </section>
  );
}
