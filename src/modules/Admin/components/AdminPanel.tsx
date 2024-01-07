"use client";
import { useStableCallback } from "@/common/hooks";
import { QrScanner } from "@yudiel/react-qr-scanner";
import debounce from "lodash.debounce";
import { useLayoutEffect, useMemo, useReducer } from "react";
import IcSuccess from "@material-ui/icons/CheckCircle";
import IcError from "@material-ui/icons/Error";
import { GuestData } from "@/modules/Admin/types";
import invariant from "invariant";

type SendResultSuccessResponse = {
  status: "success";
  data: GuestData;
  message: string;
};

type SendResultErrorResponse = {
  status: "error";
  message: string;
};

type AdminPanelProps = {
  spreadsheetId: string;
  sendResult: (
    result: string,
  ) => Promise<SendResultSuccessResponse | SendResultErrorResponse>;
};

export function AdminPanel(props: AdminPanelProps) {
  const [state, dispatch] = useReducer(adminPanelReducer, initialState);

  const sendResultProp: (
    result: string,
  ) => Promise<SendResultSuccessResponse | SendResultErrorResponse> =
    useStableCallback(
      props.sendResult ??
        (() =>
          Promise.resolve({
            status: "error",
            message: "sendResult is not defined",
          })),
    );

  const sendResult = useMemo(() => {
    return debounce(async (result: string) => {
      dispatch({ type: "scanning_result", payload: result });
      dispatch({
        type: "process_response",
        payload: await sendResultProp(result),
      });
    }, 1000);
  }, [sendResultProp]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  invariant(props.spreadsheetId, "GOOGLE_DOCUMENT_ID is required");

  return (
    <div className="h-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl">Scan invitation QR</h1>
        <div style={{ height: 200, width: 200 }}>
          <QrScanner
            tracker
            scanDelay={1000}
            constraints={{ frameRate: 10 }}
            onDecode={(result) => sendResult(result)}
            onError={(error) => alert(error.message)}
          />
        </div>
        <div className="w-full" style={{ height: 100, maxHeight: 100 }}>
          {renderResultState(state)}
        </div>
      </div>
      <center>
        <iframe
          className="w-full md:w-3/4 self-center"
          height={500}
          src={`https://docs.google.com/spreadsheets/d/${props.spreadsheetId}/edit?gid=0&single=true&rm=minimal&widget=true&headers=false`}
        />
      </center>
    </div>
  );
}

function renderResultState(state: InvitationQRState) {
  switch (state.loadingState) {
    case "scanning":
      return "Scanning...";
    case "loading":
      return "Loading... Invitation code: " + state.qrValue;
    case "error":
      return (
        <div
          className="bg-red-500 p-2 flex flex-col justify-center items-center w-full"
          style={{ height: 100 }}
        >
          <b>
            <IcError fontSize="small" />
            Error, please try to re-scan
          </b>
          <p>Reason: {state.invitationData.message}</p>
        </div>
      );
    case "success": {
      const { data, message } = state.invitationData;

      const rows = Object.entries(data).sort((e) => (e[0] === "name" ? -1 : 1));

      return (
        <div
          className="p-2 flex flex-col justify-center items-center bg-green-400 w-full"
          style={{ height: 100 }}
        >
          <b>
            <IcSuccess fontSize="small" />
            Status: {message}
          </b>
          <table className="w-full mt-1">
            <thead>
              <tr className="uppercase">
                {rows.map(([key]) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {rows.map(([key, value]) => (
                  <td key={key + value}>{String(value)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
}

type InvitationQRState =
  | {
      qrValue?: string;
      invitationData: undefined;
      loadingState: "scanning" | "loading";
    }
  | {
      qrValue?: string;
      invitationData: SendResultSuccessResponse;
      loadingState: "success";
    }
  | {
      qrValue?: string;
      invitationData: SendResultErrorResponse;
      loadingState: "error";
    };

const initialState: InvitationQRState = {
  qrValue: undefined,
  invitationData: {
    message: "Not yet scanned",
    status: "success",
    data: {
      id: "7HAWDH",
      vip: false,
      name: "Nadia Rizqi",
      pax: 0,
    },
  },
  loadingState: "success",
};

function adminPanelReducer(
  state: InvitationQRState,
  action: { type: string; payload: unknown },
): InvitationQRState {
  switch (action.type) {
    case "scanning_result": {
      return {
        invitationData: undefined,
        qrValue: action.payload as string,
        loadingState: "loading",
      };
    }
    case "process_response": {
      const payload = action.payload as
        | SendResultSuccessResponse
        | SendResultErrorResponse;

      if (payload.status === "success") {
        return {
          qrValue: state.qrValue,
          invitationData: payload,
          loadingState: "success",
        };
      } else if (payload.status === "error") {
        return {
          qrValue: state.qrValue,
          invitationData: payload,
          loadingState: "error",
        };
      }

      return {
        invitationData: undefined,
        qrValue: state.qrValue,
        loadingState: "scanning",
      };
    }
    default:
      return state;
  }
}
