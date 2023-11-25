import { RSVPService } from "./RSVP/service";
import { sheetdb } from "./db";

sheetdb.connect();

export const rsvpService = RSVPService.createRSVPServiceWithSheet(
  sheetdb.spreadsheet,
);
