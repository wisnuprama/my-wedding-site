"use client";
import { useEffect, useState } from "react";

function now() {
  return Date.now() / 1000;
}

type Timer = number;

export type TimerConfig = {
  refreshInterval: number;
  translate: (n: number) => number;
};

export const TimerPresets = {
  DAYS: {
    refreshInterval: 86400 * 1000,
    translate: (n: number) => Math.floor(n / 86400),
  },
  HOURS: {
    refreshInterval: 3600 * 1000,
    translate: (n: number) => Math.floor((n % 86400) / 3600),
  },
  MINUTES: {
    refreshInterval: 60 * 1000,
    translate: (n: number) => Math.floor((n % 3600) / 60),
  },
  SECONDS: {
    refreshInterval: 1 * 1000,
    translate: (n: number) => Math.floor(n % 60),
  },
} as const;

export function useTimer(deadline: number, config: TimerConfig): Timer {
  const [remainder, setCurrentRemainingTime] = useState(() => deadline - now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRemainingTime(deadline - now());
    }, config.refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [deadline, config.refreshInterval]);

  return config.translate(remainder);
}
