import { jwtVerify } from "jose";
import { RSVPTokenData } from "./types";
import { RSVPContextValue } from "./context";

export class RSVPManager {
  private privateKey: Uint8Array | null = null;

  constructor() {
    const encoder = new TextEncoder();
    this.privateKey = process.env.RSVP_PRIVATE_KEY
      ? encoder.encode(process.env.RSVP_PRIVATE_KEY)
      : null;
  }

  async verifyAndDecodeToken(
    token: string | null | undefined
  ): Promise<[true, RSVPTokenData] | [false, null]> {
    if (!token) {
      return [false, null];
    }

    if (!this.privateKey) {
      throw new Error("No private key found");
    }

    try {
      const res = await jwtVerify(token, this.privateKey, {
        algorithms: ["HS256"],
        typ: "JWT",
      });
      return [true, res.payload as RSVPTokenData];
    } catch (error) {
      return [false, null];
    }
  }
}

export async function useRSVPManagerContextValue(
  rsvpToken: string | undefined
): Promise<RSVPContextValue> {
  const manager = new RSVPManager();

  const [isValidRSVP, tokenData] = await manager.verifyAndDecodeToken(
    rsvpToken
  );

  if (!isValidRSVP) {
    return {
      isValidRSVP: false,
    };
  }

  return {
    isValidRSVP,
    data: {
      name: tokenData.nm,
      userId: tokenData.id,
      userTitle: tokenData.t,
      message: tokenData.m,
    },
  };
}
