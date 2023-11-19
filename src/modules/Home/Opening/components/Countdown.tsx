"use client";

import { useI18n } from "@/core/i18n";
import { TimerConfig, TimerPresets, useTimer } from "@/modules/useTimer";
import { font } from "@/core/styles";
import { useClientRender } from "@/modules/common";

export type CountdownProps = {
  /**
   * Unix timestamp in seconds
   */
  deadline: number;
};

export function Countdown(props: CountdownProps) {
  const { deadline } = props;
  const i18n = useI18n();

  const isClientRender = useClientRender();

  // Avoid rendering on server
  // because timer result can be different
  // between server and client by the time it's rendered in client
  return (
    <div className="flex flex-row justify-evenly">
      {isClientRender ? (
        <>
          <Timer
            label={i18n.t("label_counting_day")}
            deadline={deadline}
            timerConfig={TimerPresets.DAYS}
          />
          <Timer
            label={i18n.t("label_counting_hour")}
            deadline={deadline}
            timerConfig={TimerPresets.HOURS}
          />
          <Timer
            label={i18n.t("label_counting_minute")}
            deadline={deadline}
            timerConfig={TimerPresets.MINUTES}
          />
          <Timer
            label={i18n.t("label_counting_second")}
            deadline={deadline}
            timerConfig={TimerPresets.SECONDS}
          />
        </>
      ) : (
        <div style={{ height: TIMER_CONTAINER_HEIGHT }} />
      )}
    </div>
  );
}

const TIMER_HEIGHT = 75;
const TIMER_CONTAINER_HEIGHT = TIMER_HEIGHT;

type TimerProps = {
  label: string;

  timerConfig: TimerConfig;

  /**
   * Unix timestamp in seconds
   */
  deadline: number;
};

function Timer(props: TimerProps) {
  const { label, deadline, timerConfig } = props;

  const c = useTimer(deadline, timerConfig);

  return (
    <div
      className="flex flex-col justify-center items-center p-2"
      style={styles.timerContainerStyle}
    >
      <div className={`${font.className} text-3xl md:text-4xl`}>{c}</div>
      <div className={`${font.className} text-xs mt-1`}>{label}</div>
    </div>
  );
}

const styles = {
  timerContainerStyle: {
    borderWidth: 1,
    width: TIMER_HEIGHT,
    height: TIMER_HEIGHT,
    borderColor: "rgb(var(--foreground-rgb))",
  },
} as const;
