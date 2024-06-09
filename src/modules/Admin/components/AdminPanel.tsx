"use client";
import { useStableCallback } from "@/common/hooks";
import { Scanner } from "@yudiel/react-qr-scanner";
import debounce from "lodash.debounce";
import {
  ReactNode,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
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
  sendScannerResult: (
    result: string,
  ) => Promise<SendResultSuccessResponse | SendResultErrorResponse>;
  setManualAttendance: (
    id: string,
    isAttending: boolean,
  ) => Promise<SendResultSuccessResponse | SendResultErrorResponse>;
};

export function AdminPanel(props: AdminPanelProps) {
  const [isScannerEnabled, toggleScanner] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    if (typeof window !== "undefined" && "URLSearchParams" in window) {
      const url = new URL(String(window.location));

      if (url.searchParams.has("s")) {
        toggleScanner(url.searchParams.get("s") === "1");
      } else {
        toggleScanner(true);
      }
    }
  }, []);

  function handleToggleClick() {
    toggleScanner(!isScannerEnabled);
    if (typeof window !== "undefined" && "URLSearchParams" in window) {
      const url = new URL(String(window.location));
      url.searchParams.set("s", isScannerEnabled ? "0" : "1");
      history.pushState(null, "", url);
    }
  }

  const searchRef = useRef<{ setQuery(s: string): void }>(null);

  return (
    <div className="font-sans flex flex-col overflow-auto">
      <div className="flex flex-col justify-center items-center">
        {isScannerEnabled ? (
          <RSVPScanner
            sendScannerResult={props.sendScannerResult}
            setSearchQuery={(query) => {
              searchRef.current?.setQuery(query);
            }}
          />
        ) : null}
      </div>
      <GuestList
        searchRef={searchRef}
        guestListData={props.guestListData}
        setManualAttendance={props.setManualAttendance}
        toggleScanner={toggleScanner}
        extraData={isScannerEnabled}
        toggleButton={
          <button
            onClick={handleToggleClick}
            className={`rounded-lg p-2 ml-2 ${
              isScannerEnabled ? "bg-red-500" : "bg-green-500"
            } text-white font-bold cursor-pointer`}
          >
            <CameraIcon />
          </button>
        }
      />
    </div>
  );
}

function RSVPScanner({
  sendScannerResult,
  setSearchQuery,
}: {
  sendScannerResult: AdminPanelProps["sendScannerResult"];
  setSearchQuery: (query: string) => void;
}) {
  const sendResultProp: (
    result: string,
  ) => Promise<SendResultSuccessResponse | SendResultErrorResponse> =
    useStableCallback(sendScannerResult);

  const stableSetSearchQuery = useStableCallback(setSearchQuery);

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

      if (resp.status === "success") {
        stableSetSearchQuery(resp.data.id);
      }

      setTimeout(() => {
        alert("Refreshing...");
        window.location.reload();
      }, 1000);
    }, 1000);
  }, [sendResultProp, stableSetSearchQuery]);

  const [state, dispatch] = useReducer(rsvpScannerReducer, getInitialState());

  function reset() {
    window.location.reload();
  }

  return (
    <>
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
        {renderResultState(state, reset)}
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
const GuestList = memo(
  ({
    guestListData,
    setManualAttendance,
    extraData,
    searchRef,
    toggleScanner,
    toggleButton,
  }: {
    searchRef: React.RefObject<{ setQuery(s: string): void }>;
    guestListData: GuestData[];
    setManualAttendance: (
      id: string,
      isAttending: boolean,
    ) => Promise<SendResultSuccessResponse | SendResultErrorResponse>;
    extraData: unknown;
    toggleScanner: (state: boolean) => void;
    toggleButton: ReactNode;
  }) => {
    const [isLoading, toggleLoading] = useReducer((state) => !state, false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    const [searchText, setSearchText] = useState(() => {
      if (typeof window !== "undefined" && "URLSearchParams" in window) {
        const url = new URL(String(window.location));
        return url.searchParams.get("q") || "";
      }

      return "";
    });

    const setQuery = useStableCallback((value) => {
      setSearchText(value);
      if ("URLSearchParams" in window) {
        const url = new URL(String(window.location));
        url.searchParams.set("q", value);
        history.pushState(null, "", url);
      }
    });

    useImperativeHandle(
      searchRef,
      () => ({
        setQuery,
      }),
      [setQuery],
    );

    useLayoutEffect(() => {
      const height =
        (containerRef.current?.clientHeight || 0) -
        (bottomRef.current?.clientHeight || 0);

      setContainerHeight(height);
    }, [extraData]);

    const filteredData = searchText
      ? guestListData.filter((data) => {
          if (data.id.includes(searchText)) {
            return true;
          }

          const query = searchText.trim().toLowerCase().split(" ");
          const searchableText = `${data.name} ${data.reason}`;

          return query.every((q) => searchableText.toLowerCase().includes(q));
        })
      : guestListData;

    // Component to render each row
    const Row = useMemo(() => {
      // side effect to update the attendance status and loading state
      async function setValue(id: string, isAttending: boolean) {
        toggleLoading();

        let isDone = false;
        const timeout = setTimeout(() => {
          if (!isDone) {
            alert("Request timeout, please try again");
            toggleLoading();
          }
        }, 5000);

        const res = await setManualAttendance(id, isAttending);
        clearTimeout(timeout);

        if (res.status === "success") {
          window.location.reload();
        } else {
          alert(res.message);

          toggleLoading();
        }

        isDone = true;
      }

      // Create a memoized component + inject the dependency
      const GuestRow = makeGuestRow(setValue);
      const Comp = (props: ListChildComponentProps<GuestData[]>) => {
        return <GuestRow {...props} />;
      };

      Comp.displayName = "GuestRow";

      return Comp;
    }, [setManualAttendance]);

    return (
      <>
        <div>
          {isLoading ? (
            <div
              className="absolute top-0 bottom-0 left-0 right-0 z-50 flex justify-center items-center"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <div role="status">
                <LoadingIcon />
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : null}
          <div
            ref={containerRef}
            className="bg-white w-full px-2 pt-2 flex-grow"
            style={{ height: "100dvh" }}
          >
            <AutoSizer>
              {({ width }) => (
                <FixedSizeList<GuestData[]>
                  itemCount={filteredData.length}
                  width={width}
                  height={containerHeight}
                  itemSize={150}
                  itemKey={(index, data) => data[index].id}
                  itemData={filteredData}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>
        </div>
        <div
          ref={bottomRef}
          className="w-full flex p-2 fixed bottom-0 bg-white text-black shadow-[rgba(0,0,15,0.5)_50px_0px_0px_0px] items-center"
        >
          <label htmlFor="search-name" className="mr-2">
            Search
          </label>
          <input
            style={{ color: "black", borderColor: "lightgrey", borderWidth: 1 }}
            className="flex-grow px-1 rounded"
            id="search-name"
            type="text"
            placeholder="Enter 6 digit ID or Person Name or Group Name"
            value={searchText}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onClick={() => toggleScanner(false)}
          />
          {toggleButton}
        </div>
      </>
    );
  },
);

function makeGuestRow(
  setValue: (id: string, isAttending: boolean) => unknown,
): React.FC<ListChildComponentProps<GuestData[]>> {
  function GuestRow({
    data,
    index,
    style,
  }: ListChildComponentProps<GuestData[]>) {
    const guestData = data[index];

    const debouncedOnClick = useMemo(
      () =>
        debounce(() => {
          setValue(guestData.id, !guestData.isAttending);
        }, 500),
      [guestData.id, guestData.isAttending],
    );

    return (
      <div
        style={{ ...style, color: "black" }}
        className="py-1 px-2 border-2  rounded-lg shadow"
      >
        <div style={{ fontWeight: 700, fontFamily: "sans-serif" }}>
          {guestData.name}
        </div>
        <div className="flex flex-row gap-5">
          <ul className="flex-1">
            <li>ID: {guestData.id}</li>
            <li>Pax: {guestData.pax}</li>
            <li>VIP: {guestData.vip ? "yes" : "no"}</li>
            <li>Reason: {guestData.reason}</li>
          </ul>
          <ul>
            <li>Will attend: {guestData.willAttend ? "yes" : "no"}</li>
            <li>Attended: {guestData.isAttending ? "yes" : "no"}</li>
          </ul>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              onChange={debouncedOnClick}
              checked={Boolean(guestData.isAttending)}
              style={{ width: 24, height: 24 }}
              className={`py-1 px-2 rounded`}
            />
          </div>
        </div>
      </div>
    );
  }

  return GuestRow;
}

function renderResultState(state: InvitationQRState, reset: Function) {
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
          onClick={() => reset()}
        >
          <b>
            <IcError fontSize="small" />
            Error, please try to re-scan
          </b>
          <p>Reason: {state.invitationData.message}</p>
          <PrimaryButton onClick={() => reset()}>OK</PrimaryButton>
        </div>
      );
    case "success": {
      const { data, message } = state.invitationData;

      return (
        <div
          className="p-2 flex flex-col justify-center items-center bg-green-400 w-full cursor-pointer"
          onClick={() => reset()}
        >
          <span>
            <b>
              <IcSuccess fontSize="small" />
              Status: {message}
            </b>
          </span>
          <PrimaryButton onClick={() => reset()}>Done</PrimaryButton>
        </div>
      );
    }
  }
}

type InvitationQRState =
  | {
      firstLoad: boolean;
      qrValue?: string;
      invitationData: undefined;
      loadingState: "scanning" | "loading";
      scanTimestamp: number;
    }
  | {
      firstLoad: boolean;
      qrValue?: string;
      invitationData: SendResultSuccessResponse;
      loadingState: "success";
      scanTimestamp: number;
    }
  | {
      firstLoad: boolean;
      qrValue?: string;
      invitationData: SendResultErrorResponse;
      loadingState: "error";
      scanTimestamp: number;
    };

function getInitialState(): InvitationQRState {
  return {
    firstLoad: true,
    qrValue: undefined,
    invitationData: undefined,
    loadingState: "scanning",
    scanTimestamp: Date.now(),
  };
}

function rsvpScannerReducer(
  state: InvitationQRState,
  action: { type: string; payload: unknown },
): InvitationQRState {
  switch (action.type) {
    case "scanning_result": {
      return {
        ...state,
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
          firstLoad: false,
          qrValue: state.qrValue,
          invitationData: payload,
          loadingState: "success",
          scanTimestamp: state.scanTimestamp,
        };
      } else if (payload.status === "error") {
        return {
          firstLoad: false,
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

function CameraIcon() {
  return (
    <svg
      fill="#000000"
      height="16px"
      width="16px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 74.207 74.207"
    >
      <g>
        <path
          d="M57.746,14.658h-2.757l-1.021-3.363c-0.965-3.178-3.844-5.313-7.164-5.313H28.801c-3.321,0-6.201,2.135-7.165,5.313
      l-1.021,3.363h-4.153C7.385,14.658,0,22.043,0,31.121v20.642c0,9.077,7.385,16.462,16.462,16.462h41.283
      c9.077,0,16.462-7.385,16.462-16.462V31.121C74.208,22.043,66.823,14.658,57.746,14.658z M68.208,51.762
      c0,5.769-4.693,10.462-10.462,10.462H16.462C10.693,62.223,6,57.53,6,51.762V31.121c0-5.769,4.693-10.462,10.462-10.462h8.603
      l2.313-7.621c0.192-0.631,0.764-1.055,1.423-1.055h18.003c0.659,0,1.23,0.424,1.423,1.057l2.314,7.619h7.204
      c5.769,0,10.462,4.693,10.462,10.462L68.208,51.762L68.208,51.762z"
        />
        <path
          d="M37.228,25.406c-8.844,0-16.04,7.195-16.04,16.04c0,8.844,7.195,16.039,16.04,16.039s16.041-7.195,16.041-16.039
      C53.269,32.601,46.073,25.406,37.228,25.406z M37.228,51.486c-5.536,0-10.04-4.504-10.04-10.039c0-5.536,4.504-10.04,10.04-10.04
      c5.537,0,10.041,4.504,10.041,10.04C47.269,46.982,42.765,51.486,37.228,51.486z"
        />
      </g>
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
}
