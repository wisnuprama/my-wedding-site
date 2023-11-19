interface Config {
  FOOTER_URL: string;
  COPYRIGHT_AUTHOR: string;
  COPYRIGHT_YEAR: number;
  WEDDING_DAY_TIMESTAMP: number;

  VENUE_MAP_URL?: string;
  CALENDAR_URL?: string;
  SCHEDULES?: Array<{
    titleKey: string;
    startTime: number;
    endTime: number;
  }>;
}

declare const config: Config;

export default config;
