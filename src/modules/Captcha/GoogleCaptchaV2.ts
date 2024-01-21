import invariant from "invariant";
import type { Captcha } from "./types";

type VerifyResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
};

export class GoogleCaptchaV2 implements Captcha<string> {
  constructor(
    private readonly siteKey: string,
    private readonly secretKey: string,
  ) {}

  getSiteKey(): string {
    return this.siteKey;
  }

  async verify(
    userResponse: string,
    opt?: { abort?: AbortSignal },
  ): Promise<boolean> {
    // https://www.google.com/recaptcha/api/siteverify

    const url = new URL("https://www.google.com/recaptcha/api/siteverify");

    url.searchParams.append("secret", this.secretKey);
    url.searchParams.append("response", userResponse);

    const request = new Request(url, {
      method: "POST",
      signal: opt?.abort,
    });

    let response: Response;
    try {
      response = await fetch(request);
    } catch (err) {
      console.error(err);
      return false;
    }

    let data: VerifyResponse | undefined;
    try {
      data = await response.json();
    } catch (err) {
      console.error(err);
      return false;
    }

    if (data?.["error-codes"]?.length) {
      console.error(data["error-codes"]);
      return false;
    }

    return Boolean(data?.success);
  }

  static create() {
    const siteKey = process.env.GOOGLE_RECAPTCHA_CLIENT_KEY;
    const privateKey = process.env.GOOGLE_RECAPTCHA_PRIVATE_KEY;

    invariant(siteKey, "Missing GOOGLE_RECAPTCHA_CLIENT_KEY env variable");
    invariant(privateKey, "Missing GOOGLE_RECAPTCHA_PRIVATE_KEY env variable");

    return new GoogleCaptchaV2(siteKey, privateKey);
  }
}
