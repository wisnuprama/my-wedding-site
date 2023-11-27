import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import invariant from "invariant";

export type RSVPRow = {
  id: string;
  nama: string;
  will_attend: "TRUE" | "FALSE";
  rsvp_done: "TRUE" | "FALSE";
  actual_pax: string;
  estimated_pax: string;
  attended: "TRUE" | "FALSE";
  accessibility: string;
  vip: "TRUE" | "FALSE";
  source: string;
  personal_message: string;
};

export class RSVPSheetModel {
  private readonly sheet: GoogleSpreadsheetWorksheet;
  private hasLoadedCells = false;

  /**
   * For mutex lock when refreshing cache and
   * prevent multiple refreshes at the same time.
   */
  private refreshCachePromise: Promise<void> | null = null;

  constructor(sheet: GoogleSpreadsheetWorksheet) {
    this.sheet = sheet;
  }

  public async refreshCache() {
    if (this.refreshCachePromise) {
      return this.refreshCachePromise;
    }

    this.hasLoadedCells = true;
    this.refreshCachePromise = this.sheet.loadCells();

    await this.refreshCachePromise;

    this.refreshCachePromise = null;
  }

  /**
   * Find RSVP by ID from cache. If cache is not loaded, it will load the cache first with data from Google Sheets.
   * @param id RSVP ID
   * @returns CellRow | undefined
   */
  public async findByIdFromCache(id: string) {
    if (!this.hasLoadedCells) {
      await this.refreshCache();
    }

    // find from cache
    const row = (await this.sheet.getRows<RSVPRow>()).find(
      (row) => row.get("id") === id,
    );

    return row;
  }

  public async findById(id: string) {
    const row = (await this.findAll()).find((row) => row.get("id") === id);

    return row;
  }

  public async findAll() {
    await this.refreshCache();
    const rows = await this.sheet.getRows<RSVPRow>();

    return rows;
  }

  public static createRSVPSheetModel(spreadsheet: GoogleSpreadsheet) {
    const sheet = spreadsheet.sheetsByTitle["RSVP"];
    invariant(sheet, "RSVP sheet not found");
    return new RSVPSheetModel(sheet);
  }
}
