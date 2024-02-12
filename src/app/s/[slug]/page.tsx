"use server";

import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import slugTable from "./slug-table.json";

import { isbot } from "isbot";

type ShortenerProps = {
  params: {
    slug?: keyof typeof slugTable;
  };
};

export default async function Shortener(props: ShortenerProps) {
  const { params } = props;

  const headersList = headers();

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
