"use server";
import { PrimaryLink } from "@/components/Link";
import { useServerI18n } from "@/core/i18n";
import { RSVPForm, RSVPMode, RSVPViewModel } from "@/modules/RSVP";

type RSVPWishesFormProps = {
  rsvpViewModel: RSVPViewModel;
};

export async function RSVPWishesForm(props: RSVPWishesFormProps) {
  const { rsvpViewModel } = props;

  const i18n = useServerI18n();

  if (!rsvpViewModel.isValidRSVP) {
    return null;
  }

  const [formExtraData, err] = await rsvpViewModel.getFormExtraData();

  if (err) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>{err.errorMsg}</p>
      </div>
    );
  }

  if (rsvpViewModel.rsvpMode === RSVPMode.FILLED_ATTEND) {
    return (
      <div className="pt-8 px-8 flex flex-col justify-center items-center">
        <p>{i18n.t("msg_thank_you_attending")}</p>
        <PrimaryLink className="mt-4" href="/event-card">
          {i18n.t("label_see_your_invitation_card")}
        </PrimaryLink>
      </div>
    );
  }

  if (rsvpViewModel.rsvpMode === RSVPMode.FILLED) {
    return (
      <div className="pt-8 px-8 flex justify-center items-center">
        <p>{i18n.t("msg_thank_you_responding")}</p>
      </div>
    );
  }

  const { name } = rsvpViewModel.rsvpUserData;

  return (
    <RSVPForm
      rsvpToken={rsvpViewModel.rsvpToken}
      name={name}
      estimatedPax={formExtraData.estimatedPax}
      rsvpMode={rsvpViewModel.rsvpMode}
      submit={rsvpViewModel.submit}
    />
  );
}
