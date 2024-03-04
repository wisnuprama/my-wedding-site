"use client";

import { useI18n } from "@/core/i18n";
import * as Sentry from "@sentry/nextjs";

export function useSharing(
  getData: () => { title: string; text: string; url: string },
) {
  const i18n = useI18n();

  const handleSharing = async () => {
    const data = getData();
    if (!navigator.share) {
      await navigator.clipboard.writeText(data.url);
      alert(i18n.t("msg_alert_sharing_clipboard"));
      return;
    }

    try {
      await navigator.share(data);
    } catch (e: any) {
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
