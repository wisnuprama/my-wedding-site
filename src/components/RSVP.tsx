"use client";

import React, { HTMLProps, useState } from "react";

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
      <div className="flex">
        <label className="mr-2 flex-1" htmlFor={inputProps.name}>
          {labelText}
        </label>
        {React.Children.map(React.Children.only(children), (child) => {
          return React.cloneElement(child, {
            ...inputProps,
            className:
              "flex-grow border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-pink-600 focus:border-transparent",
          });
        })}
      </div>
      <small>{helpText}</small>
    </div>
  );
}

export function RSVP() {
  const [isValidPhone, setIsValidPhone] = useState(false);

  return (
    <div className="px-24 pt-40">
      <h2 className="text-4xl font-medium mb-36">RSVP</h2>

      <form className="flex flex-col">
        <InputContainer
          labelText="Whatsapp"
          name="phone_number"
          id="phone_number"
          helpText="Your whatsapp phone number for receiving OTP"
        >
          <input onBlur={() => setIsValidPhone(true)} />
        </InputContainer>

        <InputContainer labelText="Full Name" name="name" id="name">
          <input />
        </InputContainer>

        <InputContainer
          labelText="Will you attend?"
          name="rsvp_response"
          id="rsvp_response"
        >
          <select placeholder="Please select">
            <option selected>---</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </InputContainer>

        <InputContainer
          labelText="Attendant"
          name="num_of_attendant"
          id="num_of_attendant"
          helpText="Excluding children(s)"
        >
          <select placeholder="Please select" defaultValue={0}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </InputContainer>

        <InputContainer labelText="OTP" name="otp" id="otp">
          <input onBlur={() => setIsValidPhone(true)} />
        </InputContainer>

        <button
          type="submit"
          className="px-4 py-1 text-sm text-white rounded-full border border-pink-200 bg-pink-600 hover:bg-pink-500 hover:border-transparent disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2"
          disabled={!isValidPhone}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
