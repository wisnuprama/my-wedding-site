"use client";
import { useStableCallback } from "@/common/hooks";
import { QrScanner } from "@yudiel/react-qr-scanner";
import debounce from "lodash.debounce";
import { useLayoutEffect, useMemo, useReducer } from "react";
import IcSuccess from "@material-ui/icons/CheckCircle";
import IcError from "@material-ui/icons/Error";
import { GuestData } from "@/modules/Admin/types";
import invariant from "invariant";
import { PrimaryButton } from "@/components/Link";

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
  const [state, dispatch] = useReducer(adminPanelReducer, getInitialState());

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
      if (result.length !== 6) {
        dispatch({ type: "reset", payload: result });
        return;
      }

      dispatch({ type: "scanning_result", payload: result });

      const resp = await sendResultProp(result);

      dispatch({
        type: "process_response",
        payload: resp,
      });
    }, 1000);
  }, [sendResultProp]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  invariant(props.spreadsheetId, "GOOGLE_DOCUMENT_ID is required");

  return (
    <div className="h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl">Scan invitation QR</h1>
        <div style={{ height: 200, width: 200 }}>
          <QrScanner
            key={state.scanTimestamp}
            tracker
            scanDelay={1000}
            constraints={{ frameRate: 10 }}
            onDecode={(result) => sendResult(result)}
            onError={(error) => alert(error.message)}
          />
        </div>
        <div className="w-full" style={{ maxHeight: 200 }}>
          {renderResultState(state, dispatch)}
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

function renderResultState(state: InvitationQRState, dispatch: Function) {
  switch (state.loadingState) {
    case "scanning":
      return (
        <div className="p-2 bg-yellow-300 cursor-progress">
          <center>Scanning...</center>
        </div>
      );
    case "loading":
      return (
        <div className="p-2 bg-blue-400 cursor-progress">
          <center>{"Loading... Invitation code: " + state.qrValue}</center>
        </div>
      );
    case "error":
      return (
        <div
          className="bg-red-500 p-2 flex flex-col justify-center items-center w-full cursor-pointer"
          onClick={() => dispatch({ type: "reset", payload: undefined })}
        >
          <b>
            <IcError fontSize="small" />
            Error, please try to re-scan
          </b>
          <p>Reason: {state.invitationData.message}</p>
          <PrimaryButton
            onClick={() => dispatch({ type: "reset", payload: undefined })}
          >
            OK
          </PrimaryButton>
        </div>
      );
    case "success": {
      const { data, message } = state.invitationData;

      const rows = Object.entries(data).sort((e) => (e[0] === "name" ? -1 : 1));

      return (
        <div
          className="p-2 flex flex-col justify-center items-center bg-green-400 w-full cursor-pointer"
          onClick={() => dispatch({ type: "reset", payload: undefined })}
        >
          <span>
            <b>
              <IcSuccess fontSize="small" />
              Status: {message}
            </b>
          </span>
          <div className="flex flex-1 flex-wrap justify-evenly items-start">
            {rows.map(([key, value]) => (
              <div key={key + value} className="p-1 bg-white mr-1">
                {key}={renderValue(value)}
              </div>
            ))}
          </div>
          <PrimaryButton
            onClick={() => dispatch({ type: "reset", payload: undefined })}
          >
            Done
          </PrimaryButton>
        </div>
      );
    }
  }
}

function renderValue(value: string | number | boolean) {
  switch (typeof value) {
    case "boolean":
      return <input type="checkbox" checked={value} disabled />;
    default:
      return value;
  }
}

type InvitationQRState =
  | {
      qrValue?: string;
      invitationData: undefined;
      loadingState: "scanning" | "loading";
      scanTimestamp: number;
    }
  | {
      qrValue?: string;
      invitationData: SendResultSuccessResponse;
      loadingState: "success";
      scanTimestamp: number;
    }
  | {
      qrValue?: string;
      invitationData: SendResultErrorResponse;
      loadingState: "error";
      scanTimestamp: number;
    };

function getInitialState(): InvitationQRState {
  return {
    qrValue: undefined,
    invitationData: undefined,
    loadingState: "scanning",
    scanTimestamp: Date.now(),
  };
}

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
        scanTimestamp: Date.now(),
      };
    }
    case "reset": {
      return getInitialState();
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
          scanTimestamp: state.scanTimestamp,
        };
      } else if (payload.status === "error") {
        return {
          qrValue: state.qrValue,
          invitationData: payload,
          loadingState: "error",
          scanTimestamp: state.scanTimestamp,
        };
      }

      return getInitialState();
    }
    default:
      return state;
  }
}
