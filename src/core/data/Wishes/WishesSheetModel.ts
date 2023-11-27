import config from "@/core/config";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import invariant from "invariant";
import schedule from "node-schedule";

export type WishRow = {
  from: string;
  message: string;
  ctime: string;
};

export class WishesSheetModel {
  private readonly sheet: GoogleSpreadsheetWorksheet;
  private rowCache: Array<GoogleSpreadsheetRow<WishRow>> | null = null;
  private refreshCacheJob: ReturnType<typeof schedule.scheduleJob>;

  constructor(sheet: GoogleSpreadsheetWorksheet) {
    this.sheet = sheet;

    const interval = config.CACHE_REFRESH_SCHEDULE ?? "0 0 * * *";
    this.refreshCacheJob = schedule.scheduleJob(interval, () => {
      console.info("[WishesSheetModel] running refreshCache per-schedule");
      this.refreshCache();
    });
  }

  public async refreshCache() {
    this.rowCache = await this.sheet.getRows<WishRow>();
  }

  public createWish(from: string, message: string) {
    this.sheet.addRow({
      from,
      message,
      ctime: Date.now(),
    });
  }

  public async findAllFromCache() {
    return this.rowCache ?? this.findAll();
  }

  public async findAll() {
    this.rowCache = await this.sheet.getRows<WishRow>();
    return this.rowCache;
  }

  public static createWishesSheetModel(spreadsheet: GoogleSpreadsheet) {
    const sheet = spreadsheet.sheetsByTitle["Wishes"];
    invariant(sheet, "Wishes sheet not found");
    return new WishesSheetModel(sheet);
  }
}
