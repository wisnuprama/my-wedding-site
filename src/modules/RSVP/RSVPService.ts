import { RSVPFormDTO } from "./dto";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { RSVPRow, RSVPSheetModel } from "@/core/data/RSVP/RSVPSheetModel";
import { getServerI18n } from "@/core/i18n";
import { ServiceErrorCode } from "@/modules/ServiceError/errorcode";
import { WishesSheetModel, sheetdb } from "@/core/data";
import { deserializeSheetData, serializeSheetData } from "@/core/data/utils";
import { evalOnce } from "@/common/helper";
import { RSVPFormExtraData, RSVPUserData, RSVPGuestData } from "./types";
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

export interface WishesModel {
  createWish(from: string, message: string): Promise<unknown>;
  refreshCache(): Promise<void>;
}

export class RSVPService {
  private rsvpModel!: RSVPModel;
  private wishesModel!: WishesModel;

  protected setRsvpModel(model: RSVPModel) {
    this.rsvpModel = model;
  }

  protected setWishesModel(model: WishesModel) {
    this.wishesModel = model;
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

  public async shouldDisplayEventCard(id: string): Promise<boolean> {
    const [rsvp, err] = await this.getRSVPByIdOrCache(id);

    if (err != null) {
      return false;
    }

    return rsvp.get("rsvp_done") === "TRUE";
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
        willAttend: rsvp.get("will_attend"),
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
  }> {
    const i18n = getServerI18n();
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      console.info(`RSVP not found: ${id}`);
      return {
        error: ServiceErrorCode.RSVP_NOT_FOUND,
        errorMsg: i18n.t("error_msg_rsvp_not_found"),
      };
    }

    type Struct = ReturnType<typeof input.toObject>;
    type Key = keyof ReturnType<typeof input.toObject>;
    type StructDB = {
      [K in Key]: Struct[K] extends boolean ? "TRUE" | "FALSE" : string;
    };

    const data = serializeSheetData<Struct, StructDB>(input.toObject());

    rsvp.set("rsvp_done", "TRUE");
    rsvp.set("actual_pax", data.actualPax);
    rsvp.set("will_attend", data.willAttend);

    // NOTE: might be good idea to make this atomic
    await rsvp.save();

    if (data.wishMessage) {
      this.wishesModel.createWish(rsvp.get("nama"), data.wishMessage);
    }

    try {
      this.rsvpModel.refreshCache();
      this.wishesModel.refreshCache();
    } catch (e) {
      console.error({
        error: e,
        message: "Failed to refresh",
      });
    }

    return {
      error: ServiceErrorCode.OK,
    };
  }

  public async updateGuestAttendance(
    id: string,
    isAttending: boolean,
  ): Promise<ServiceError | undefined> {
    const i18n = getServerI18n();
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      console.info(`RSVP not found: ${id}`);
      return new ServiceError(
        ServiceErrorCode.RSVP_NOT_FOUND,
        i18n.t("error_msg_rsvp_not_found"),
      );
    }

    try {
      rsvp.set("attended", isAttending ? "TRUE" : "FALSE");
      await rsvp.save();
    } catch (_) {
      return new ServiceError(
        ServiceErrorCode.FAILED_TO_UPDATE_GUEST_ATTENDANCE,
        i18n.t("error_msg_failed_update_guest_attendance"),
      );
    }
  }

  public async updateGuestSouvenirCollection(
    id: string,
    hasCollected: boolean,
  ): Promise<ServiceError | undefined> {
    const i18n = getServerI18n();
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      console.info(`RSVP not found: ${id}`);
      return new ServiceError(
        ServiceErrorCode.RSVP_NOT_FOUND,
        i18n.t("error_msg_rsvp_not_found"),
      );
    }

    try {
      rsvp.set("has_collected_souvenir", hasCollected ? "TRUE" : "FALSE");
      await rsvp.save();
    } catch (_) {
      return new ServiceError(
        ServiceErrorCode.FAILED_TO_UPDATE_GUEST_ATTENDANCE,
        i18n.t("error_msg_failed_update_guest_attendance"),
      );
    }
  }

  public async getGuestData(
    id: string,
  ): Promise<[RSVPGuestData, null] | [null, ServiceError]> {
    const i18n = getServerI18n();
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      console.info(`RSVP not found: ${id}`);
      return [
        null,
        new ServiceError(
          ServiceErrorCode.RSVP_NOT_FOUND,
          i18n.t("error_msg_rsvp_not_found"),
        ),
      ];
    }

    return [
      deserializeSheetData({
        id: rsvp.get("id"),
        name: rsvp.get("nama"),
        pax: rsvp.get("actual_pax") || rsvp.get("estimated_pax"),
        vip: rsvp.get("vip"),
        willAttend: rsvp.get("will_attend"),
        hasCollectedSouvenir: rsvp.get("has_collected_souvenir"),
        isAttending: rsvp.get("attended"),
      }),
      null,
    ];
  }

  public static createRSVPServiceWithSheet(spreadsheet: GoogleSpreadsheet) {
    const service = new RSVPService();

    service.setRsvpModel(RSVPSheetModel.getInstance(spreadsheet));
    service.setWishesModel(WishesSheetModel.getInstance(spreadsheet));

    return service;
  }
}

export const getRSVPService = evalOnce(async () =>
  RSVPService.createRSVPServiceWithSheet(await sheetdb.getSpreadsheet()),
);
