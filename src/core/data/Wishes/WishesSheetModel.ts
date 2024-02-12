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

  public async createWish(from: string, message: string, isVerified: boolean) {
    const r = await this.sheet.addRow({
      from,
      message,
      ctime: Date.now() / 1000,
      is_verified: isVerified ? "TRUE" : "FALSE",
    });

    await this.refreshCache();

    return r;
  }

  public async findAllFromCache() {
    if (!this.rowCache || process.env.DISABLE_CACHING) {
      await this.refreshCache();
    }

    return this.rowCache;
  }

  public async findAll() {
    this.rowCache = await this.sheet.getRows<WishRow>();
    return this.rowCache;
  }

  private static instance: WishesSheetModel | null = null;
  public static getInstance(spreadsheet: GoogleSpreadsheet) {
    if (!WishesSheetModel.instance) {
      const sheet = spreadsheet.sheetsByTitle["Wishes"];
      invariant(sheet, "Wishes sheet not found");
      WishesSheetModel.instance = new WishesSheetModel(sheet);
    }

    return WishesSheetModel.instance;
  }
}
