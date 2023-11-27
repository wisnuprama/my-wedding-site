import { createGoogleSpreadsheet } from "@/modules/GoogleSpreadsheet";
import { GoogleSpreadsheet } from "google-spreadsheet";
import invariant from "invariant";

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
      await this.init();
      console.info(
        "[GoogleSpreadsheetDatabase] connected to Google Spreadsheet: ",
        {
          title: this.spreadsheet.title,
        },
      );
    } catch (e: any) {
      console.error(
        "[GoogleSpreadsheetDatabase] failed to connect to Google Spreadsheet",
        { error: e },
      );
      return e;
    }
  }
}

export const sheetdb = new GoogleSpreadsheetDatabase(createGoogleSpreadsheet());
