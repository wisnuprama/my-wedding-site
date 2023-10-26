import { cookies } from "next/headers";

import id from "./id.json";
import en from "./en.json";

enum Locale {
  ID = "id",
  EN = "en",
}

export const getLocale = (): Locale => {
  const locale = cookies().get("locale");
  return (locale?.value as Locale) || Locale.ID;
};

export const setLocale = (locale: Locale) => {
  cookies().set("locale", locale);
};

class I18nManager {
  store: Record<Locale, Record<string, string>> = {
    id,
    en,
  };

  t(key: string) {
    const locale = getLocale();
    return this.store[locale][key];
  }
}

export const i18n = new I18nManager();
