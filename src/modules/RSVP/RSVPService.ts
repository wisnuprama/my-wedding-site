import { RSVPFormDTO } from "./dto";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { RSVPRow, RSVPSheetModel } from "@/core/data/RSVP/RSVPSheetModel";
import { getServerI18n } from "@/core/i18n";
import { ServiceErrorCode } from "@/modules/ServiceError/errorcode";
import { sheetdb } from "@/core/data";
import { deserializeSheetData, serializeSheetData } from "@/core/data/utils";
import { evalOnce } from "@/common/helper";
import { RSVPFormExtraData, RSVPUserData } from "./types";
import { ServiceError } from "@/modules/ServiceError";

export interface RSVPInstance {
  save(): Promise<void>;
  toObject(): Partial<RSVPRow>;
  set<K extends keyof RSVPRow>(key: K, value: RSVPRow[K]): void;
  get<K extends keyof RSVPRow>(key: K): RSVPRow[K];
}

export interface RSVPModel {
  refreshCache(): Promise<void>;
  findByIdFromCache(id: string): Promise<RSVPInstance | undefined>;
  findById(id: string): Promise<RSVPInstance | undefined>;
  findAll(): Promise<RSVPInstance[]>;
}

export class RSVPService {
  private rsvpModel!: RSVPModel;

  protected setRsvpModel(model: RSVPModel) {
    this.rsvpModel = model;
  }

  private async getRSVPByIdOrCache(
    id: string,
  ): Promise<[RSVPInstance, undefined] | [undefined, ServiceError]> {
    const i18n = getServerI18n();

    let rsvp: Awaited<ReturnType<typeof this.rsvpModel.findByIdFromCache>>;
    try {
      rsvp = await this.rsvpModel.findByIdFromCache(id);
    } catch (e) {
      console.error({
        error: ServiceErrorCode.FAILED_TO_DETERMINE_RSVP_STATUS,
      });
      return [
        undefined,
        new ServiceError(
          ServiceErrorCode.FAILED_TO_DETERMINE_RSVP_STATUS,
          i18n.t("error_msg_failed_to_determine_rsvp_status"),
        ),
      ];
    }

    // try to get RSVP from sheet if not found in cache
    if (!rsvp) {
      try {
        rsvp = await this.rsvpModel.findById(id);
      } catch (e) {
        console.error({
          error: ServiceErrorCode.FAILED_TO_DETERMINE_RSVP_STATUS,
        });
        return [
          undefined,
          new ServiceError(
            ServiceErrorCode.FAILED_TO_DETERMINE_RSVP_STATUS,
            i18n.t("error_msg_failed_to_determine_rsvp_status"),
          ),
        ];
      }
    }

    if (!rsvp) {
      console.info(`RSVP not found: ${id}`);
      return [
        undefined,
        new ServiceError(
          ServiceErrorCode.RSVP_NOT_FOUND,
          i18n.t("error_msg_rsvp_not_found"),
        ),
      ];
    }

    return [rsvp, undefined];
  }

  public async getUserData(
    id: string,
  ): Promise<[RSVPUserData, undefined] | [undefined, ServiceError]> {
    const [rsvp, err] = await this.getRSVPByIdOrCache(id);

    if (err != null) {
      return [undefined, err];
    }

    return [
      deserializeSheetData({
        rsvpID: id,
        name: rsvp.get("nama"),
        message: rsvp.get("personal_message"),
      }),
      undefined,
    ];
  }

  /**
   *
   * @param id
   * @returns
   * @throws {Error} if RSVP not found
   */
  public async getFormExtraData(
    id: string,
  ): Promise<[RSVPFormExtraData, undefined] | [undefined, ServiceError]> {
    const [rsvp, err] = await this.getRSVPByIdOrCache(id);

    if (err != null) {
      return [undefined, err];
    }

    return [
      deserializeSheetData({
        filled: rsvp.get("rsvp_done"),
        willAttend: rsvp.get("attended"),
        estimatedPax: rsvp.get("estimated_pax"),
      }),
      undefined,
    ];
  }

  public async fillRSVPById(
    id: string,
    input: RSVPFormDTO,
  ): Promise<{
    error: ServiceErrorCode;
    errorMsg?: string;
  } | void> {
    const i18n = getServerI18n();
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      console.info(`RSVP not found: ${id}`);
      return {
        error: ServiceErrorCode.RSVP_NOT_FOUND,
        errorMsg: i18n.t("error_msg_rsvp_not_found"),
      };
    }

    queueMicrotask(() => {
      this.rsvpModel.refreshCache();
    });

    type Struct = ReturnType<typeof input.validate>;
    type Key = keyof ReturnType<typeof input.validate>;
    type StructDB = {
      [K in Key]: Struct[K] extends boolean ? "TRUE" | "FALSE" : string;
    };

    const data = serializeSheetData<Struct, StructDB>(input.validate());

    rsvp.set("rsvp_done", "TRUE");
    rsvp.set("actual_pax", data.actualPax);
    rsvp.set("will_attend", data.willAttend);

    if (data.accessibility) {
      rsvp.set("accessibility", data.accessibility);
    }
    rsvp.save();
  }

  public static createRSVPServiceWithSheet(spreadsheet: GoogleSpreadsheet) {
    const rsvpModel = RSVPSheetModel.createRSVPSheetModel(spreadsheet);

    const service = new RSVPService();
    service.setRsvpModel(rsvpModel);
    return service;
  }
}

export const getRSVPService = evalOnce(async () =>
  RSVPService.createRSVPServiceWithSheet(await sheetdb.getSpreadsheet()),
);
