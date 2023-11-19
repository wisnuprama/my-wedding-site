import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";

export type RSVPWishesSectionProps = {};

export function RSVPWishesSection(_: RSVPWishesSectionProps) {
  const i18n = useServerI18n();
  return (
    <section className="h-screen px-8 py-24 md:flex md:flex-col">
      <h1
        className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className} text-center`}
      >
        {i18n.t("title_rsvp_and_wishes")}
      </h1>
    </section>
  );
}
