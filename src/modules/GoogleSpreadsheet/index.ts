import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import invariant from "invariant";

export function createGoogleSpreadsheet() {
  invariant(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    "GOOGLE_SERVICE_ACCOUNT_EMAIL is required",
  );
  invariant(
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required",
  );

  const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
  ];

  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Need to replace \n accordingly based on https://github.com/vercel/next.js/issues/45578
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });

  invariant(process.env.GOOGLE_DOCUMENT_ID, "GOOGLE_DOCUMENT_ID is required");
  return new GoogleSpreadsheet(process.env.GOOGLE_DOCUMENT_ID, jwt);
}
