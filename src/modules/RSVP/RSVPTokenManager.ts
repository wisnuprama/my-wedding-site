import { jwtVerify } from "jose";
import { RSVPTokenData } from "./types";
import { cookies } from "next/headers";

export class RSVPTokenManager {
  private privateKey: Uint8Array | null = null;

  constructor() {
    const encoder = new TextEncoder();
    this.privateKey = process.env.RSVP_PRIVATE_KEY
      ? encoder.encode(process.env.RSVP_PRIVATE_KEY)
      : null;
  }

  public getTokenFromCookie(): string | undefined {
    return cookies().get("ws_r")?.value;
  }

  public clearTokenCookie(): void {
    cookies().delete("ws_r");
  }

  public async verifyAndDecodeToken(
    token: string | null | undefined,
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
