import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { Countdown } from "./components/Countdown";
import config from "@/core/config";
import { PersonalMessage } from "./components/PersonalMessage";
import { RSVPMode, RSVPViewModel } from "@/modules/RSVP";

type CountdownSectionProps = {
  rsvpViewModel: RSVPViewModel;
  containerStyle?: React.CSSProperties;
};

export function CountdownSection(props: CountdownSectionProps) {
  const { containerStyle, rsvpViewModel } = props;
  const i18n = useServerI18n();

  const formatter = new Intl.DateTimeFormat(i18n.getLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function renderInvitationQuote() {
    if (!rsvpViewModel.isValidRSVP) {
      return null;
    }

    const quoteText =
      rsvpViewModel.rsvpMode === RSVPMode.FULL
        ? "label_invitation_card_invite_quote"
        : "label_invitation_card_blessing_quote";

    return (
      <div className="flex-1 flex flex-col justify-center items-center px-2">
        <p
          className="text-center text-lg"
          dangerouslySetInnerHTML={{
            __html: i18n.t(quoteText),
          }}
        />

        <PersonalMessage />
      </div>
    );
  }

  return (
    <section
      className="flex flex-col justify-end items-center pb-8"
      style={containerStyle}
    >
      {renderInvitationQuote()}
      <p className="text-xl">
        {formatter.format(config.WEDDING_DAY_TIMESTAMP * 1000)}
      </p>
      <h2 className={`mt-5 text-3xl ${fontCursive.className}`}>
        {i18n.t("label_counting_down")}
      </h2>
      <div className="mt-5 pb-7 px-3 w-full md:max-w-screen-md">
        <Countdown deadline={config.WEDDING_DAY_TIMESTAMP} />
      </div>
    </section>
  );
}
