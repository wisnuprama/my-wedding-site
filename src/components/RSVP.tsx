"use client";

import React from "react";
import QRCode from "react-qr-code";

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
        <label className="mb-2 lg:mr-2 flex-1" htmlFor={inputProps.name}>
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

type RSVPProps = {
  rsvpCode: string;
  invitationCode?: string;
};

export function RSVP(props: RSVPProps) {
  const { invitationCode } = props;

  return (
    <div className="px-24 pt-40">
      {Boolean(invitationCode) && (
        <>
          <h2 className="text-4xl font-medium mb-16 md:mb-36">
            Invitation
          </h2>
          <div>
            {/* @ts-expect-error hack */}
            <QRCode size={"100%"} value={invitationCode} />
            <div className="pt-8 flex flex-row">
              <span className="mr-2">ℹ️</span>
              <p>
                Tunjukan QR ini ketika datang atau gunakan kode berikut
                <b>
                  <i>{` "${invitationCode}" `}</i>
                </b>
                jika ditemukan masalah.
              </p>
            </div>
          </div>
        </>
      )}

      <h2 className="text-4xl font-medium mb-16 md:mb-36">RSVP</h2>
      <form className="flex flex-col">
        <InputContainer labelText="Full Name" name="name" id="name">
          <input type="text" disabled value={"Nadia Rizqi Aziza"} />
        </InputContainer>

        <InputContainer
          labelText="Will you attend?"
          name="rsvp_response"
          id="rsvp_response"
        >
          <select placeholder="Please select" defaultValue="">
            <option value="">---</option>
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

        <button
          type="submit"
          className="px-4 py-1 text-sm text-white rounded-full border border-pink-200 bg-pink-600 hover:bg-pink-500 hover:border-transparent disabled:text-slate-600 disabled:text-grey focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2"
          disabled
        >
          Submit
        </button>
      </form>
    </div>
  );
}
