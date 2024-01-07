"use server";
import { RSVPService, getRSVPService } from "../RSVP/RSVPService";
import { GuestData } from "./types";
import invariant from "invariant";
import { getServerI18n } from "@/core/i18n";

interface GuestBookViewModel {
  updateGuestAttendanceByQR(
    id: string,
  ): Promise<
    UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
  >;
  updateGuestAttendance(
    id: string,
    isAttending: boolean,
  ): Promise<
    UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
  >;
}

type UpdateGuestAttendanceSuccessResponse = {
  status: "success";
  data: GuestData;
  message: string;
};

type UpdateGuestAttendanceErrorResponse = {
  status: "error";
  message: string;
};

class GuestBookViewModelImpl implements GuestBookViewModel {
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
}

export async function updateGuestAttendance(
  vm: GuestBookViewModel,
  id: string,
  isAttending: boolean,
): Promise<
  UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
> {
  return vm.updateGuestAttendance(id, isAttending);
}

export async function updateGuestAttendanceByQR(
  vm: GuestBookViewModel,
  id: string,
): Promise<
  UpdateGuestAttendanceSuccessResponse | UpdateGuestAttendanceErrorResponse
> {
  return vm.updateGuestAttendance(id, true);
}

export async function getGuestBookViewModel(): Promise<GuestBookViewModel> {
  const viewModel = new GuestBookViewModelImpl();
  viewModel.setRSVPService(await getRSVPService());
  return viewModel;
}
