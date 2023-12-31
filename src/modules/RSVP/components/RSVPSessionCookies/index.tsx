import { redirect } from "next/navigation";
import { RSVPTokenManager } from "../../RSVPTokenManager";

type SearchParams = {
  /**
   * RSVP token
   */
  t?: string;
  /**
   * means client must check whether the cookies exist before proceeding to set the cookies again
   */
  c?: string;
};

/**
 * To decide whether to set the cookies or not after webview redirection
 * @param searchParams
 * @returns Promise<void | never> - if the cookies already exist, it will return void, otherwise it will redirect to the home page
 */
export async function reviewRSVPSession(
  searchParams?: SearchParams,
): Promise<void | never> {
  if (!searchParams) {
    return;
  }

  const { t, c } = searchParams;

  // default when no params, continue with normal flow
  if (!t && !c) {
    return;
  }

  // clean up invalid request params
  if (!t || !c) {
    return redirect("/");
  }

  const rsvpTokenManager = new RSVPTokenManager();

  const cookieRSVPToken = rsvpTokenManager.getTokenFromCookie();
  const isSameToken = cookieRSVPToken === t;

  // if different then proceed with the given token
  if (cookieRSVPToken && isSameToken) {
    const [isCookieValid] =
      await rsvpTokenManager.verifyAndDecodeToken(cookieRSVPToken);
    if (isCookieValid) {
      // ignore if the cookies already exist and valid
      return;
    }

    // invalid, so clear cookie and proceed with the given token
    rsvpTokenManager.clearTokenCookie();
  }

  const rsvpToken = t;
  const [isValid] = await rsvpTokenManager.verifyAndDecodeToken(rsvpToken);

  if (!isValid) {
    redirect("/");
  }

  // edge case when the cookies & the given token are diff
  // e.g. opening diff link from telegram + webview + opening diff RSVP URL
  // in this case we will prioritize the given token and need to make sure
  // that when they click "Open in Browser" it will open the correct & latest RSVP token.
  let shouldKeepC = "";
  if (cookieRSVPToken && !isSameToken) {
    shouldKeepC = "&d=1";
  }

  redirect(`/rsvp?t=${rsvpToken}&c=1` + shouldKeepC);
}
