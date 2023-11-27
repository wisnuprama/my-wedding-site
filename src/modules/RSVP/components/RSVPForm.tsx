import { PrimaryButton } from "@/components/Link";
import React, { useMemo } from "react";

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
  name: string;
  estimatedPax: number;
};

export function RSVPForm(props: RSVPFormProps) {
  const { name, estimatedPax } = props;

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
      <form className="flex flex-col">
        <InputContainer labelText="Full Name" name="name" id="name">
          <input type="text" disabled value={name} required />
        </InputContainer>

        <InputContainer
          labelText="Will you join us?"
          name="rsvp_response"
          id="rsvp_response"
        >
          <select placeholder="Please select" defaultValue="" required>
            <option value="">---</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </InputContainer>

        <InputContainer
          labelText="Attendances"
          name="num_of_attendances"
          id="num_of_attendances"
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
          name="rsvp_response"
          id="rsvp_response"
        >
          <select placeholder="Please select" defaultValue="" required>
            <option value="">---</option>
            <option value="no">Old</option>
            <option value="yes">Wheelchair Access</option>
          </select>
        </InputContainer>

        <InputContainer labelText="Wishes" name="wishes" id="wishes">
          <textarea rows={4} />
        </InputContainer>

        <PrimaryButton className="self-center" type="submit" disabled>
          Submit
        </PrimaryButton>
      </form>
    </div>
  );
}
