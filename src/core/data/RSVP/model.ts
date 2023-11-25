import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import invariant from "invariant";

export type RSVPRow = {
  id: string;
  nama: string;
  will_attend: boolean;
  rsvp_done: boolean;
  actual_pax: number;
  attended: boolean;
  accessibility: string;
  vip: boolean;
  source: string;
};

export class RSVPSheetModel {
  private readonly sheet: GoogleSpreadsheetWorksheet;

  constructor(sheet: GoogleSpreadsheetWorksheet) {
    this.sheet = sheet;
  }

  reload() {
    this.sheet.loadCells();
  }

  public async findById(id: string) {
    const rows = await this.findAll();
    return rows.find((row) => row.get("id") === id);
  }

  public async findAll() {
    this.reload();
    const rows = await this.sheet.getRows<RSVPRow>();
    return rows;
  }

  public static createRSVPSheetModel(spreadsheet: GoogleSpreadsheet) {
    const sheet = spreadsheet.sheetsByTitle["RSVP"];
    invariant(sheet, "RSVP sheet not found");
    return new RSVPSheetModel(sheet);
  }
}
