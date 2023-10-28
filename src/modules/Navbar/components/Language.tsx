"use client";

import { Locale, useClientI18n } from "@/core/i18n";
import Image from "next/image";

export function Language() {
  const i18n = useClientI18n();

  const changeLanguageAndRefresh = (l: Locale) => {
    i18n.switchLanguage(l);
    window.location.reload();
  };

  return (
    <div id="language" className="flex flex-row">
      <Image
        src="/images/ic_language.png"
        alt="Change Language"
        width={14}
        height={14}
        style={{ width: 14, height: 14 }}
      />
      <span className="text-xs">
        <span onClick={() => changeLanguageAndRefresh(Locale.EN)}>ENG</span>
        {" | "}
        <span onClick={() => changeLanguageAndRefresh(Locale.ID)}>ID</span>
      </span>
    </div>
  );
}
