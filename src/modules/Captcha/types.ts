export interface Captcha<R = any> {
  getSiteKey(): string;
  verify(userResponse: R): Promise<boolean>;
}
