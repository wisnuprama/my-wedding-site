import invariant from "invariant";
import { RedirectType, redirect as nextRedirect } from "next/navigation";

/**
 * Override host name and redirect to the given url
 * @param url
 * @param type
 */
export function redirect(url: string, type?: RedirectType) {
  const hostname = getHostname();

  const overridenURL = new URL(url, hostname).toString();

  nextRedirect(overridenURL, type);
}

export function getHostname() {
  invariant(process.env.APP_HOSTNAME, "APP_HOSTNAME is not defined");
  return process.env.APP_HOSTNAME;
}
