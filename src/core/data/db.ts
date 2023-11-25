import { createGoogleSpreadsheet } from "@/modules/GoogleSpreadsheet";
import { GoogleSpreadsheet } from "google-spreadsheet";

export interface Database<Q> {
  connect(): Promise<Error | undefined>;
}

class GoogleSpreadsheetDatabase implements Database<{}> {
  public readonly spreadsheet: GoogleSpreadsheet;

  constructor(spreadsheet: GoogleSpreadsheet) {
    this.spreadsheet = spreadsheet;
  }

  public async connect(): Promise<Error | undefined> {
    console.log("connecting to Google Spreadsheet");

    try {
      await this.spreadsheet.loadInfo();
      console.log("connected to Google Spreadsheet: ", {
        title: this.spreadsheet.title,
      });
    } catch (e: any) {
      console.error("failed to connect to Google Spreadsheet");
      return e;
    }
  }
}

export const sheetdb = new GoogleSpreadsheetDatabase(createGoogleSpreadsheet());
