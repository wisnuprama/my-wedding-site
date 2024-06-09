"use server";
import { RSVPService, getRSVPService } from "../RSVP/RSVPService";
import { GuestData } from "./types";
import invariant from "invariant";
import { getServerI18n } from "@/core/i18n";

type UpdateGuestSuccessResponse = {
  status: "success";
  data: GuestData;
  message: string;
};

type UpdateGuestListSuccessResponse = {
  status: "success";
  data: GuestData[];
  message: string;
};

type UpdateGuestErrorResponse = {
  status: "error";
  message: string;
};

class GuestBookService {
  private rsvpService!: RSVPService;

  public setRSVPService(service: RSVPService) {
    this.rsvpService = service;
  }

  public async updateGuestAttendance(
    id: string,
    isAttending: boolean,
  ): Promise<UpdateGuestSuccessResponse | UpdateGuestErrorResponse> {
    const i18n = getServerI18n();

    const err = await this.rsvpService.updateGuestAttendance(id, isAttending);

    if (err) {
      return {
        status: "error",
        message: err.errorMsg || "Unknown error",
      };
    }

    const [data] = await this.rsvpService.getGuestData(id);

    invariant(
      data,
      "Guest data not found after successfully update the attendance",
    );

    return {
      status: "success",
      message: i18n.t("msg_success_update_attendance"),
      data,
    };
  }

  public async updateGuestSouvenirCollection(
    id: string,
    isCollecting: boolean,
  ): Promise<UpdateGuestSuccessResponse | UpdateGuestErrorResponse> {
    const i18n = getServerI18n();

    const err = await this.rsvpService.updateGuestSouvenirCollection(
      id,
      isCollecting,
    );

    if (err) {
      return {
        status: "error",
        message: err.errorMsg || "Unknown error",
      };
    }

    const [data] = await this.rsvpService.getGuestData(id);

    invariant(
      data,
      "Guest data not found after successfully update the souvenir collection",
    );

    return {
      status: "success",
      message: i18n.t("msg_success_update_souvenir_collection"),
      data,
    };
  }

  public async getAllGuestData(): Promise<
    UpdateGuestListSuccessResponse | UpdateGuestErrorResponse
  > {
    const TEMP_LIMIT = 10; // @wisnuprama - temporary limit for testing purpose. Remove before the event.

    const [guests, err] = await this.rsvpService.getAllGuestData();

    if (err) {
      return {
        status: "error",
        message: err.errorMsg || "Unknown error",
      };
    }

    return {
      status: "success",
      message: "Success",
      data: guests.slice(0, TEMP_LIMIT),
    };
  }

  public static async create(): Promise<GuestBookService> {
    const service = new GuestBookService();
    service.setRSVPService(await getRSVPService());
    return service;
  }
}

export async function updateGuestIsAttending(
  id: string,
): Promise<UpdateGuestSuccessResponse | UpdateGuestErrorResponse> {
  const service = await GuestBookService.create();
  return service.updateGuestAttendance(id, true);
}

export async function setGuestIsAttending(
  id: string,
  isAttending: boolean,
): Promise<UpdateGuestSuccessResponse | UpdateGuestErrorResponse> {
  const service = await GuestBookService.create();
  return service.updateGuestAttendance(id, Boolean(isAttending));
}

export async function updateGuestIsCollectingSouvenir(
  id: string,
): Promise<UpdateGuestSuccessResponse | UpdateGuestErrorResponse> {
  const service = await GuestBookService.create();
  return service.updateGuestSouvenirCollection(id, true);
}

export async function getAllGuestData(): Promise<
  UpdateGuestListSuccessResponse | UpdateGuestErrorResponse
> {
  const service = await GuestBookService.create();
  return service.getAllGuestData();
}
