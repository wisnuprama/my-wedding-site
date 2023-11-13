"use client";

import { useI18n } from "@/core/i18n";
import { TimerConfig, TimerPresets, useTimer } from "@/modules/useTimer";

export type CountdownProps = {
  /**
   * Unix timestamp in seconds
   */
  deadline: number;
};

export function Countdown(props: CountdownProps) {
  const { deadline } = props;
  const i18n = useI18n();

  return (
    <div>
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
    </div>
  );
}

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
    <div>
      <div>{c}</div>
      <div>{label}</div>
    </div>
  );
}
