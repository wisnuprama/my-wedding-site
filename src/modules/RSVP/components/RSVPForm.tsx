"use client";
import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import React, { useEffect, useMemo } from "react";
import { RSVPFormState } from "../actions/submitRSVP";
import { useFormState, useFormStatus } from "react-dom";
import IcWarning from "@material-ui/icons/Warning";
import config from "@/core/config";
import { useRouter } from "next/navigation";

type InputProps = {
  labelText: string;
  helpText?: string;
  name: string;
  id: string;
  children: React.ReactElement<HTMLSelectElement | HTMLInputElement>;
};

function InputContainer(props: InputProps) {
  const { labelText, helpText, children, ...inputProps } = props;
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row">
        <label className="mb-2 lg:mr-2 md:flex-1" htmlFor={inputProps.name}>
          {labelText}
        </label>
        {React.Children.map(React.Children.only(children), (child) => {
          return React.cloneElement(child, {
            ...inputProps,
            // @ts-expect-error
            style: { backgroundColor: "rgba(var(--backgroud-input))" },
            className:
              "md:flex-1 backdrop-blur-sm flex-grow border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-pink-600 focus:border-transparent",
          });
        })}
      </div>
      <small>{helpText}</small>
    </div>
  );
}

type RSVPFormProps = {
  submit: (state: RSVPFormState, formData: FormData) => Promise<RSVPFormState>;
  name: string;
  estimatedPax: number;
  rsvpToken: string;
};

const initialState: RSVPFormState = {
  status: null,
  message: null,
};

export function RSVPForm(props: RSVPFormProps) {
  const { name, estimatedPax, submit, rsvpToken } = props;
  const router = useRouter();
  const i18n = useI18n();

  const [state, formAction] = useFormState(submit, initialState);

  useEffect(() => {
    if (state.status !== "ok") {
      return;
    }
    router.refresh();

    const redirectTo = state.redirectTo;

    if (redirectTo) {
      setTimeout(() => {
        router.push(redirectTo);
      }, 3000);
    }
  }, [state.status, router, state.redirectTo]);

  const attendancesOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= config.MAX_ATTENDANCES; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>,
      );
    }
    return options;
  }, []);

  return (
    <div className="mt-12 md:w-1/2 w-full self-center">
      <form className="flex flex-col" action={formAction}>
        <input type="hidden" value={rsvpToken} name="rsvpToken" />
        <InputContainer
          labelText={i18n.t("label_full_name")}
          name="name"
          id="name"
        >
          <input type="text" disabled value={name} required />
        </InputContainer>

        <InputContainer
          labelText={i18n.t("label_attendance")}
          name="willAttend"
          id="willAttend"
        >
          <select placeholder="Please select" defaultValue="" required>
            <option value="">---</option>
            <option value="true">{i18n.t("label_yes")}</option>
            <option value="false">{i18n.t("label_no")}</option>
          </select>
        </InputContainer>

        <InputContainer
          labelText={i18n.t("label_no_of_guest")}
          name="actualPax"
          id="actualPax"
          helpText={i18n.t("msg_no_of_guest_help_text")}
        >
          <select
            placeholder="Please select"
            defaultValue={estimatedPax ?? 1}
            required
          >
            {attendancesOptions}
          </select>
        </InputContainer>

        <InputContainer labelText="Wishes" name="wishMessage" id="wishMessage">
          <textarea
            rows={4}
            maxLength={500}
            placeholder={i18n.t("msg_wish_placeholder_help_text")}
          />
        </InputContainer>

        {state.message && state.status === "error" ? (
          <div
            className={`rounded-md p-4 flex mb-4 backdrop-blur-md bg-opacity-75 "bg-red-500"`}
          >
            <IcWarning className="mr-2" />
            <p aria-live="polite">{state?.message}</p>
          </div>
        ) : null}

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  const i18n = useI18n();

  return (
    <PrimaryButton
      className="self-center"
      type="submit"
      style={{ cursor: "pointer" }}
    >
      {pending ? i18n.t("label_submit_pending") : i18n.t("label_submit")}
    </PrimaryButton>
  );
}
