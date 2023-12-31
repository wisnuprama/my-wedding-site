"use client";

import { Locale, useI18n } from "@/core/i18n";
import IcLanguage from "@material-ui/icons/Language";

export function Language() {
  const i18n = useI18n();

  const changeLanguageAndRefresh = (l: Locale) => {
    i18n.switchLanguage(l);
    window.location.reload();
  };

  return (
    <div
      id="language"
      className="flex flex-row justify-center items-center cursor-pointer text-xs"
    >
      <IcLanguage fontSize="inherit" style={{ marginRight: 2 }} />
      <span>
        <span onClick={() => changeLanguageAndRefresh(Locale.EN)}>ENG</span>
        {" | "}
        <span onClick={() => changeLanguageAndRefresh(Locale.ID)}>ID</span>
      </span>
    </div>
  );
}
