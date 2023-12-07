"use server";
import { useServerI18n } from "@/core/i18n";
import { RSVPForm, ValidRSVPViewModel } from "@/modules/RSVP";

type RSVPWishesFormProps = {
  rsvpViewModel: ValidRSVPViewModel;
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

  if (formExtraData.filled && formExtraData.willAttend) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>{i18n.t("msg_thank_you_attending")}</p>
      </div>
    );
  }

  const { name } = rsvpViewModel.rsvpUserData;

  return (
    <RSVPForm
      rsvpToken={rsvpViewModel.rsvpToken}
      name={name}
      estimatedPax={formExtraData.estimatedPax}
      submit={rsvpViewModel.submit}
    />
  );
}
