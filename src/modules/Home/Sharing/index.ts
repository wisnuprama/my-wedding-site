"use client";

import { useI18n } from "@/core/i18n";

export function useSharing(data: { title: string; text: string; url: string }) {
  const i18n = useI18n();

  const handleSharing = async () => {
    if (!navigator.share) {
      alert(i18n.t("msg_alert_sharing_clipboard"));
    }

    navigator.clipboard.writeText(data.url);
    try {
      await navigator.share(data);
    } catch (_) {}
  };

  return handleSharing;
}
