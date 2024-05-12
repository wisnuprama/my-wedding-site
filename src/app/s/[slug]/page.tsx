"use server";

import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import _slugTable from "./slug-table.json";

import { isbot } from "isbot";
import { evalOnce } from "@/common/helper";

const getSlugTable = evalOnce(() => {
  if (process.env.SLUG_TABLE) {
    return JSON.parse(process.env.SLUG_TABLE);
  }

  return _slugTable;
});

type ShortenerProps = {
  params: {
    slug?: string;
  };
};

export default async function Shortener(props: ShortenerProps) {
  const { params } = props;

  const headersList = headers();

  const slugTable = getSlugTable();

  if (!params.slug || !(params.slug in slugTable)) {
    redirect("/");
  }

  if (
    /* If it's a bot then redirect to homepage so they can just crawl the opengraph from homepage  */
    isbot(headersList.get("user-agent"))
  ) {
    redirect("/", RedirectType.replace);
  }

  redirect("/rsvp?t=" + slugTable[params.slug], RedirectType.replace);
}
