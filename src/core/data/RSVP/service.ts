import { RSVPFormDTO } from "./dto";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { RSVPRow, RSVPSheetModel } from "./model";

export interface RSVPInstance {
  save(): Promise<void>;
  toObject(): Partial<RSVPRow>;
  set<K extends keyof RSVPRow>(key: K, value: RSVPRow[K]): void;
  get<K extends keyof RSVPRow>(key: K): RSVPRow[K];
}

export interface RSVPModel {
  findById(id: string): Promise<RSVPInstance | undefined>;
  findAll(): Promise<RSVPInstance[]>;
}

export class RSVPService {
  private rsvpModel!: RSVPModel;

  protected setRsvpModel(model: RSVPModel) {
    this.rsvpModel = model;
  }

  public async hasFilledRSVPById(id: string): Promise<Error | boolean> {
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    return rsvp.get("rsvp_done");
  }

  public async fillRSVPById(
    id: string,
    input: RSVPFormDTO,
  ): Promise<Error | void> {
    const rsvp = await this.rsvpModel.findById(id);

    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    const data = input.validate();

    rsvp.set("rsvp_done", true);
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
