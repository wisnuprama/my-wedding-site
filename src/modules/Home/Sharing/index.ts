"use client";

import { useI18n } from "@/core/i18n";
import * as Sentry from "@sentry/nextjs";

export function useSharing(
  getData: () => { title: string; text: string; url: string },
) {
  const i18n = useI18n();

  const handleSharing = async () => {
    const data = getData();

    // share is not supported
    // copy to use clipboard instead
    if (!navigator.share) {
      await navigator.clipboard.writeText(data.url);
      alert(i18n.t("msg_alert_sharing_clipboard"));
      return;
    }

    try {
      await navigator.share(data);
    } catch (e: any) {
      if (e.name === "AbortError") {
        // ignore abort error.
        // when users cancel sharign panel, navigator.share will throw an AbortError
        // reference https://chromium.googlesource.com/chromium/src/+/34eacf936ac3255925c5045c4385dc9b5f19fa78/chrome/android/javatests/src/org/chromium/chrome/browser/webshare/WebShareTest.java
        return;
      }

      Sentry.captureException(e, {
        extra: { data },
        tags: {
          userJourney: "sharing",
          actionRequired: "monitor",
        },
      });
    }
  };

  return handleSharing;
}
