import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { RSVPViewModel } from "@/modules/RSVP";
import { RSVPWishesForm } from "./RSVPWishesForm";
import { RSVPWishesPagination } from "./RSVPWishesPagination";

export type RSVPWishesSectionProps = {
  rsvpViewModel: RSVPViewModel;
};

export async function RSVPWishesSection(props: RSVPWishesSectionProps) {
  const { rsvpViewModel } = props;

  const i18n = useServerI18n();

  if (!rsvpViewModel.isValidRSVP) {
    return (
      <section className="min-h-screen px-8 py-24 md:flex md:flex-col">
        <h1
          className={`text-4xl sm:text-5xl ${fontCursive.className} text-center`}
        >
          {i18n.t("title_rsvp_and_wishes")}
        </h1>
        <RSVPWishesPagination />
      </section>
    );
  }

  return (
    <section className="min-h-screen px-8 py-24 md:flex md:flex-col">
      <h1
        className={`text-4xl sm:text-5xl ${fontCursive.className} text-center`}
      >
        {i18n.t("title_rsvp_and_wishes")}
      </h1>
      <RSVPWishesForm rsvpViewModel={rsvpViewModel} />
      <RSVPWishesPagination />
    </section>
  );
}
