"use client";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { memo, useMemo } from "react";
import { useI18n } from "@/core/i18n";

export type WishItem = {
  from: string;
  message: string;
  ctime: number;
};

type RSVPWishesPaginationProps = {
  /**
   * JSON stringified array of WishRow
   */
  wishesJSON: string;
};

function _Wish(props: {
  index: number;
  style: React.CSSProperties;
  data: WishItem[];
}) {
  const data = props.data[props.index];

  const i18n = useI18n();

  const timeAgo = useMemo(() => {
    return formatTimeAgo(new Date(data.ctime * 1000), i18n);
  }, [data.ctime, i18n]);

  return (
    <div style={props.style} className="pb-2">
      <div
        className="h-full p-4 rounded-sm overflow-hidden"
        style={{
          background: "rgba(var(--background-card))",
        }}
      >
        <div className="flex justify-between flex-wrap">
          <p>
            <strong>{data.from}</strong>
          </p>
          <p>{timeAgo}</p>
        </div>
        <p className="mt-1 break-words text-ellipsis text-truncate">
          {data.message}
        </p>
      </div>
    </div>
  );
}

const Wish = memo(_Wish);

export function RSVPWishesPagination(props: RSVPWishesPaginationProps) {
  const { wishesJSON } = props;
  const i18n = useI18n();

  const parsedWishes = useMemo((): WishItem[] => {
    try {
      return JSON.parse(wishesJSON);
    } catch {
      return [];
    }
  }, [wishesJSON]);

  return (
    <div
      className="mt-10 p-2 backdrop-blur-md rounded-xl relative md:w-1/2 w-full self-center"
      style={{
        height: 500 + 20,
        background: "rgba(var(--background-paper))",
      }}
    >
      {parsedWishes.length > 0 ? (
        <AutoSizer>
          {({ width }) => (
            <FixedSizeList<WishItem[]>
              itemCount={parsedWishes.length}
              width={width}
              height={500}
              itemSize={140}
              itemKey={(index, data) =>
                data[index].ctime + data[index].from + index
              }
              itemData={parsedWishes}
            >
              {Wish}
            </FixedSizeList>
          )}
        </AutoSizer>
      ) : (
        <div className="text-3xl flex justify-center items-center h-full">
          {i18n.t("msg_empty_wishes")}
        </div>
      )}
    </div>
  );
}

const DIVISIONS: Array<{ amount: number; name: Intl.RelativeTimeFormatUnit }> =
  [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

function formatTimeAgo(date: Date, i18n: ReturnType<typeof useI18n>) {
  // @ts-expect-error
  let duration = (date - new Date()) / 1000;

  const formatter = new Intl.RelativeTimeFormat(i18n.getLocale(), {
    style: "short",
  });

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}
