"use client";
import { PrimaryButton } from "@/components/Link";
import { useI18n } from "@/core/i18n";
import React, { useEffect, useMemo } from "react";
import { RSVPFormState } from "../actions/submitRSVP";
import { useFormState, useFormStatus } from "react-dom";
import IcWarning from "@material-ui/icons/Warning";
import IcCheck from "@material-ui/icons/Check";

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

  const [state, formAction] = useFormState(submit, initialState);

  useEffect(() => {
    if (state.status !== "ok") {
      return;
    }

    const timeout = setTimeout(() => {
      location?.reload?.();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state.status]);

  const i18n = useI18n();

  const attendancesOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= estimatedPax; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>,
      );
    }
    return options;
  }, [estimatedPax]);

  return (
    <div className="mt-12 md:w-1/2 w-full self-center">
      <form className="flex flex-col" action={formAction}>
        <input type="hidden" value={rsvpToken} name="rsvpToken" />
        <InputContainer labelText="Full Name" name="name" id="name">
          <input type="text" disabled value={name} required />
        </InputContainer>

        <InputContainer
          labelText="Will you join us?"
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
          labelText="Attendances"
          name="actualPax"
          id="actualPax"
          helpText="Excluding children(s)"
        >
          <select
            placeholder="Please select"
            defaultValue={props.estimatedPax ?? 1}
            required
          >
            {attendancesOptions}
          </select>
        </InputContainer>

        <InputContainer
          labelText="Acessibility"
          name="accessibility"
          id="accessibility"
        >
          <select placeholder="Please select" defaultValue="">
            <option value="">---</option>
            <option value="Chair for Elderly">
              {i18n.t("label_accessibility_elderly_chair")}
            </option>
          </select>
        </InputContainer>

        <InputContainer labelText="Wishes" name="wishMessage" id="wishMessage">
          <textarea rows={4} />
        </InputContainer>

        {state.message ? (
          <div
            className={`rounded-md p-4 flex mb-4 backdrop-blur-md bg-opacity-75 ${
              state.status === "ok" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {state.status === "ok" ? (
              <IcCheck className="mr-2 " />
            ) : (
              <IcWarning className="mr-2" />
            )}
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
