"use client";

import { setCookie } from "cookies-next";
import { useEffect } from "react";

export type RSVPClientCookiesProps = {
  rsvpToken: string | undefined;
  isValidToken: boolean;
};

const productionConfig = {
  secure: true,
  sameSite: "strict",
  httpOnly: true,
} as const;

export function RSVPClientCookies(props: RSVPClientCookiesProps) {
  const { rsvpToken, isValidToken } = props;

  useEffect(() => {
    if (!rsvpToken || !isValidToken) {
      return;
    }

    // we set the token altho it is not valid
    setCookie("ws_r", rsvpToken, {
      maxAge: 60 * 60 * 24 * 365 * 10,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
      ...(process.env.NODE_ENV === "development" ? {} : productionConfig),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
