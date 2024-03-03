import { createGoogleSpreadsheet } from "@/modules/GoogleSpreadsheet";
import { withPerfTraceLog } from "@/modules/PerfTrace";
import { GoogleSpreadsheet } from "google-spreadsheet";
import invariant from "invariant";
import * as Sentry from "@sentry/nextjs";

export interface Database<Q> {
  connect(): Promise<Error | undefined>;
}

class GoogleSpreadsheetDatabase implements Database<{}> {
  private readonly spreadsheet: GoogleSpreadsheet;

  private initialize: ReturnType<typeof Promise.all> | undefined;

  constructor(spreadsheet: GoogleSpreadsheet) {
    this.spreadsheet = spreadsheet;
  }

  private async init() {
    if (this.initialize) {
      return this.initialize;
    }

    const initialize: Promise<unknown>[] = [];

    initialize.push(this.spreadsheet.loadInfo());

    this.initialize = Promise.all(initialize);

    return this.initialize;
  }

  public async getSpreadsheet() {
    invariant(this.initialize, "Database not initialized");

    await this.initialize;
    return this.spreadsheet;
  }

  public async connect(): Promise<Error | undefined> {
    console.info(
      "[GoogleSpreadsheetDatabase] connecting to Google Spreadsheet",
    );

    try {
      await withPerfTraceLog("GoogleSpreadsheetDatabase.connect", () =>
        this.init(),
      );
      console.info(
        "[GoogleSpreadsheetDatabase] connected to Google Spreadsheet: ",
        {
          title: this.spreadsheet.title,
        },
      );
      Sentry.captureMessage(
        "[GoogleSpreadsheetDatabase] connected to Google Spreadsheet",
        {
          level: "info",
          extra: {
            title: this.spreadsheet.title,
          },
          tags: {
            userJourney: "db-connection",
          },
        },
      );
    } catch (e: any) {
      Sentry.captureException(e, {
        extra: {
          "GoogleSpreadsheetDatabase.connect":
            "failed to connect to Google Spreadsheet",
        },
        tags: {
          actionRequired: "investigation",
          userJourney: "db-connection",
        },
      });
      console.error(
        "[GoogleSpreadsheetDatabase] failed to connect to Google Spreadsheet",
        process.env.NODE_ENV === "development" ? e : undefined,
      );
      return e;
    }
  }
}

export const sheetdb = new GoogleSpreadsheetDatabase(createGoogleSpreadsheet());
