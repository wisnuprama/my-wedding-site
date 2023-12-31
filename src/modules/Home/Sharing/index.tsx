"use client";

import IcShare from "@material-ui/icons/Share";
import { CSSProperties, memo, useRef } from "react";

import "./index.css";
import { useI18n } from "@/core/i18n";

function _ShareButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);

  const i18n = useI18n();

  const containerStyle: CSSProperties = {
    background: "rgba(var(--background-card))",
  };

  const handleSharing = async () => {
    const url = window.location.host;

    if (!navigator.share) {
      alert(i18n.t("msg_alert_sharing_clipboard"));
    }

    navigator.clipboard.writeText(url);
    try {
      await navigator.share({
        title: document.title,
        text: document.title,
      });
    } catch (_) {}
  };

  return (
    <div
      ref={containerRef}
      id="sharing-container"
      className="fixed bottom-14 flex backdrop-blur-md rounded-r-md shadow-sm py-2 pr-1"
      style={containerStyle}
    >
      <div ref={btnContainerRef}>
        <button onClick={handleSharing} className="h-full flex items-center">
          <IcShare />
        </button>
      </div>
    </div>
  );
}

export const Sharing = memo(_ShareButton);
