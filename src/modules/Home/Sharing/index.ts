"use client";

import { useI18n } from "@/core/i18n";

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

    await navigator.share(data);
  };

  return handleSharing;
}
