import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import invariant from "invariant";

export type WishRow = {
  from: string;
  message: string;
  ctime: string;
};

export class WishesSheetModel {
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

  /**
   * TODO: call this after users submit an RSVP
   */
  public async refreshCache() {
    if (this.refreshCachePromise) {
      return this.refreshCachePromise;
    }

    this.hasLoadedCells = true;
    this.refreshCachePromise = this.sheet.loadCells();

    await this.refreshCachePromise;

    this.refreshCachePromise = null;
  }

  public async findAll() {
    if (!this.hasLoadedCells) {
      await this.refreshCache();
    }

    const rows = await this.sheet.getRows<WishRow>();

    return rows;
  }

  public static createWishesSheetModel(spreadsheet: GoogleSpreadsheet) {
    const sheet = spreadsheet.sheetsByTitle["Wishes"];
    invariant(sheet, "Wishes sheet not found");
    return new WishesSheetModel(sheet);
  }
}
