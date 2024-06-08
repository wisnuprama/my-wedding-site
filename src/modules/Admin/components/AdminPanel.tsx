"use client";
import { useStableCallback } from "@/common/hooks";
import { Scanner } from "@yudiel/react-qr-scanner";
import debounce from "lodash.debounce";
import { memo, useLayoutEffect, useMemo, useReducer, useState } from "react";
import IcSuccess from "@material-ui/icons/CheckCircle";
import IcError from "@material-ui/icons/Error";
import { GuestData } from "@/modules/Admin/types";
import { PrimaryButton } from "@/components/Link";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";

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
  guestListData: GuestData[];
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

  return (
    <div className="h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl">Scan invitation QR</h1>
        <div style={{ height: 200, width: 200 }}>
          <Scanner
            key={state.scanTimestamp}
            scanDelay={1000}
            constraints={{ frameRate: 24, facingMode: "environment" }}
            formats={["qr_code"]}
            onScan={(result) => {
              Promise.all(result.map((r) => sendResult(r.rawValue)));
            }}
            allowMultiple={true}
          />
        </div>
        <div className="w-full" style={{ maxHeight: 200 }}>
          {renderResultState(state, dispatch)}
        </div>
      </div>
      <GuestList guestListData={props.guestListData} />
    </div>
  );
}

// eslint-disable-next-line react/display-name
const GuestList = memo(({ guestListData }: { guestListData: GuestData[] }) => {
  const [searchText, setSearchText] = useState("");

  const filteredData = searchText
    ? guestListData.filter((data) => {
        return (
          data.id.includes(searchText) ||
          data.name.toLowerCase().includes(searchText.toLowerCase())
        );
      })
    : guestListData;

  return (
    <>
      <div className="w-full flex p-1">
        <label htmlFor="search-name" className="mr-2">
          Search
        </label>
        <input
          style={{ color: "black" }}
          className="flex-grow px-1"
          id="search-name"
          type="text"
          placeholder="Enter 6 digit ID or Person Name or Group Name"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="bg-white w-full h-full">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList<GuestData[]>
              itemCount={filteredData.length}
              width={width}
              height={height}
              itemSize={150}
              itemKey={(index, data) => data[index].id}
              itemData={filteredData}
            >
              {GuestRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </>
  );
});

function GuestRow({
  data,
  index,
  style,
}: ListChildComponentProps<GuestData[]>) {
  const guestData = data[index];
  return (
    <div
      style={{ ...style, color: "black" }}
      className="p-1 border-y-2 border-gray-300"
    >
      <div>
        <b>{guestData.name}</b>
      </div>
      <div className="flex flex-row gap-5">
        <ul className="flex-1">
          <li>ID={guestData.id}</li>
          <li>Pax={guestData.pax}</li>
          <li>VIP={String(guestData.vip)}</li>
          <li>Reason={guestData.reason}</li>
        </ul>
        <ul style={{ flex: 1 }}>
          <li>Will attend={String(guestData.willAttend)}</li>
          <li>Attended={String(guestData.isAttending)}</li>
          <li>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
              {guestData.isAttending ? "Revert" : "Accept"}
            </button>
          </li>
        </ul>
      </div>
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
              <div key={key + value} className="p-1 mr-1">
                [{key}: {renderValue(value)}]
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
