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

  const formatter = new Intl.RelativeTimeFormat(i18n.getLocale(), {
    style: "short",
  });

  const diffDays = useMemo(() => {
    // Calculate the number of days between today and the wish date
    const today = new Date();
    const wishDate = new Date(data.ctime * 1000);
    const diffTime = Math.abs(today.getTime() - wishDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [data.ctime]);

  const format = (() => {
    if (diffDays < 1) {
      return "hours";
    } else if (diffDays < 7) {
      return "days";
    } else if (diffDays < 30) {
      return "weeks";
    } else if (diffDays < 365) {
      return "months";
    }

    return "years";
  })();

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
          <p>{formatter.format(-diffDays, format)}</p>
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

  const parsedWishes = useMemo((): WishItem[] => {
    try {
      return JSON.parse(wishesJSON);
    } catch {
      return [];
    }
  }, [wishesJSON]);

  return (
    <div
      className="mt-10 p-2 backdrop-blur-md rounded-xl relative"
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
          ❤️
        </div>
      )}
    </div>
  );
}
