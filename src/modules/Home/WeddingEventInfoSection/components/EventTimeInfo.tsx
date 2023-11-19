import { useServerI18n } from "@/core/i18n";
import { memo, useMemo } from "react";

export type EventTimeInfoProps = {
  containerClassName?: string;
  startTime: number;
  endTime: number;
};

function _EventTimeInfo(props: EventTimeInfoProps) {
  const { startTime, endTime, containerClassName } = props;

  const serverLocale = useServerI18n().getLocale();

  const startDate = useMemo(() => new Date(startTime * 1000), [startTime]);
  const endDate = useMemo(() => new Date(endTime * 1000), [endTime]);

  const year = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(serverLocale, {
      year: "numeric",
    });

    return formatter.format(startDate);
  }, [startDate, serverLocale]);

  const month = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(serverLocale, {
      month: "short",
    });

    return formatter.format(startDate);
  }, [startDate, serverLocale]);

  const day = useMemo(() => {
    const nameFormatter = new Intl.DateTimeFormat(serverLocale, {
      weekday: "long",
    });
    const numFormatter = new Intl.DateTimeFormat(serverLocale, {
      day: "numeric",
    });

    return {
      number: nameFormatter.format(startDate),
      name: numFormatter.format(startDate),
    };
  }, [startDate, serverLocale]);

  const timeRange = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(serverLocale, {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    return formatter.formatRange(startDate, endDate);
  }, [startDate, endDate, serverLocale]);

  return (
    <div
      className={`flex flex-col justify-center items-center text-xl uppercase ${containerClassName}`}
    >
      <div className="flex justify-evenly">
        <div className="px-7 pb-2 flex items-end">{month}</div>
        <div className="px-4" style={styles.border}>
          <div className="text-center">{day.number}</div>
          <div className="text-center text-5xl">{day.name}</div>
        </div>
        <div className="px-7 pb-2 flex items-end">{year}</div>
      </div>
      <div className="mt-4 underline underline-offset-4 decoration-1">
        {timeRange}
      </div>
    </div>
  );
}

const styles = {
  border: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgb(var(--foreground-rgb))",
  },
} as const;

export const EventTimeInfo = memo(_EventTimeInfo);
