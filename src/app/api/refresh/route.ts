import { NextResponse } from "next/server";
import { middleware } from "../middleware";
import { RSVPSheetModel, WishesSheetModel, sheetdb } from "@/core/data";

export const GET = middleware(async () => {
  const spreadsheet = await sheetdb.getSpreadsheet();

  await Promise.all([
    RSVPSheetModel.getInstance(spreadsheet).refreshCache(),
    WishesSheetModel.getInstance(spreadsheet).refreshCache(),
  ]);

  return NextResponse.json({ ok: true });
});
