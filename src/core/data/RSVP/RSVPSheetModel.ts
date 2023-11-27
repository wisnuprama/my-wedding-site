import config from "@/core/config";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import invariant from "invariant";
import schedule from "node-schedule";

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
  private rowCache: Map<RSVPRow["id"], GoogleSpreadsheetRow<RSVPRow>> =
    new Map();

  private refreshCacheJob: ReturnType<typeof schedule.scheduleJob>;

  constructor(sheet: GoogleSpreadsheetWorksheet) {
    this.sheet = sheet;

    const interval = config.CACHE_REFRESH_SCHEDULE ?? "0 0 * * *";
    this.refreshCacheJob = schedule.scheduleJob(interval, () => {
      console.info("[RSVPSheetModel] running refreshCache per-schedule");
      this.refreshCache();
    });
  }

  public async refreshCache() {
    this.rowCache = new Map();

    const rows = await this.sheet.getRows<RSVPRow>();

    rows.forEach((row) => {
      this.rowCache.set(row.get("id"), row);
    });
  }

  /**
   * Find RSVP by ID from cache. If cache is not loaded, it will load the cache first with data from Google Sheets.
   * @param id RSVP ID
   * @returns CellRow | undefined
   */
  public async findByIdFromCache(id: string) {
    if (this.rowCache.size === 0) {
      // load cache first, cheaper than calling Google Sheets API everytime we get a request
      await this.refreshCache();
    }

    const row = this.rowCache.get(id);

    return row;
  }

  public async findById(id: string) {
    const row = (await this.findAll()).find((row) => row.get("id") === id);
    // NOTE: no need to update cache here because findAll will update the cache
    // accordingly.
    return row;
  }

  public async findAll() {
    const rows = await this.sheet.getRows<RSVPRow>();

    queueMicrotask(() => {
      // update cache accordingly
      rows.forEach((row) => {
        this.rowCache.set(row.get("id"), row);
      });
    });

    return rows;
  }

  private static instance: RSVPSheetModel | null = null;
  public static getInstance(spreadsheet: GoogleSpreadsheet) {
    if (!RSVPSheetModel.instance) {
      const sheet = spreadsheet.sheetsByTitle["RSVP"];
      invariant(sheet, "RSVP sheet not found");
      RSVPSheetModel.instance = new RSVPSheetModel(sheet);
    }
    return RSVPSheetModel.instance;
  }
}
