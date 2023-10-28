"use client";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useCallback, useReducer, useState } from "react";

type ScannerProps = {};

type InvitationQRState = {
  qrValue?: string;
  invitationData: unknown;
  loadingState: "scanning" | "loading" | "error" | "success";
};

const initialState: InvitationQRState = {
  qrValue: undefined,
  invitationData: undefined,
  loadingState: "scanning",
};

function qrReducer(
  state: InvitationQRState,
  action: { type: string; payload: unknown },
): InvitationQRState {
  switch (action.type) {
    case "scanning-result": {
      return {
        ...state,
        qrValue: action.payload as string,
        loadingState: "loading",
      };
    }
    default:
      return state;
  }
}

export function Scanner(props: ScannerProps) {
  const [state, dispatch] = useReducer(qrReducer, initialState);

  const sendResult = useCallback((result: string) => {
    dispatch({ type: "scanning-result", payload: result });
  }, []);

  const content = (() => {
    switch (state.loadingState) {
      case "scanning":
        return (
          <div className="h-full w-full">
            <QrScanner
              tracker={false}
              scanDelay={1000}
              constraints={{ frameRate: 10 }}
              onDecode={(result) => sendResult(result)}
              onError={(error) => alert(error.message)}
            />
            <form
              className="bg-slate-800 p-4 text-white"
              onSubmit={(event) => {
                event.preventDefault();
                // @ts-expect-error hack
                sendResult(event.target.invitationCode.value);
              }}
            >
              <div>Manual Input</div>
              <div className="flex flex-row w-full">
                <input
                  type="text"
                  name="invitationCode"
                  className="text-black px-2 mr-8"
                  required
                />
                <button type="submit" className="bg-pink-800 p-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        );
      case "loading":
        return "Loading... Invitation code: " + state.qrValue;
      case "error":
        return <h1>Error, refresh the page</h1>;
      case "success":
        return (
          <table className="mt-20">
            <tbody>
              <tr>
                <td className="font-bold">Name</td>
                <td>Nadia Rizqi Aziza</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td className="font-bold">Invitation Status</td>
                <td>Success</td>
              </tr>
            </tbody>
          </table>
        );
    }
  })();

  return (
    <div className="flex flex-col">
      <h1 className="text-xl">Scan invitation QR</h1>
      {content}
    </div>
  );
}
