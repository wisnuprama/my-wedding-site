"use server";
import { RSVPService, getRSVPService } from "../RSVP/RSVPService";
import { GuestData } from "./types";
import invariant from "invariant";
import { getServerI18n } from "@/core/i18n";

type UpdateGuestAttendanceSuccessResponse = {
  status: "success";
  data: GuestData;
  message: string;
};

type UpdateGuestAttendanceErrorResponse = {
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
  ): Promise<
    UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
  > {
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
      message: i18n.t("success_msg_update_attendance"),
      data,
    };
  }

  public async updateGuestAttendanceByQR(
    id: string,
  ): Promise<
    UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
  > {
    return this.updateGuestAttendance(id, true);
  }

  public static async create(): Promise<GuestBookService> {
    const service = new GuestBookService();
    service.setRSVPService(await getRSVPService());
    return service;
  }
}

export async function updateGuestAttendance(
  id: string,
  isAttending: boolean,
): Promise<
  UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
> {
  const service = await GuestBookService.create();
  return service.updateGuestAttendance(id, isAttending);
}

export async function updateGuestIsAttending(
  id: string,
): Promise<
  UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
> {
  const service = await GuestBookService.create();
  return service.updateGuestAttendance(id, true);
}
