import id from "./id.json";
import en from "./en.json";
import { setCookie, getCookie } from "cookies-next";
import invariant from "invariant";

export enum Locale {
  ID = "id",
  EN = "en",
}

const DEFAULT_LANG = Locale.ID;

/**
 * Return the browser language from header/window. If not found, return the default language.
 * @returns Locale
 */
function getBrowserLanguage(getLang: () => string) {
  const lang = getLang();

  if (lang && lang.includes("en")) {
    return Locale.EN;
  }

  return DEFAULT_LANG;
}

const getServerLocale = (): Locale => {
  const cookies = require("next/headers").cookies;
  const locale = cookies().get("locale")?.value;
  if (locale) {
    return locale as Locale;
  }

  const l = getBrowserLanguage(() => {
    const headers = require("next/headers").headers;
    return headers().headers["accept-language"];
  });

  setLocale(l);
  return l;
};

const getClientLocale = (): Locale => {
  if (typeof window === "undefined") {
    return DEFAULT_LANG;
  }

  const locale = getCookie("locale");
  if (locale) {
    return locale as Locale;
  }

  const l = getBrowserLanguage(() => window.navigator.language);

  setLocale(l);
  return l;
};

const setLocale = (locale: Locale) => {
  setCookie("locale", locale, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60),
  });
};

class I18nManager {
  static instance: I18nManager;

  static getInstance(getLocale: () => Locale) {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager(getLocale());
    }

    return I18nManager.instance;
  }

  private store: Record<Locale, Record<string, string>> = {
    id,
    en,
  };

  private locale: Locale;

  constructor(locale: Locale) {
    this.locale = locale;
  }

  switchLanguage(locale: Locale) {
    invariant(this.store[locale], `Locale ${locale} is not supported`);

    this.locale = locale;
    setLocale(locale);
  }

  getLocale() {
    return this.locale;
  }

  /**
   * Given a translation key, return the translation. When not found, return the key itself.
   * @param key translation key
   * @returns
   */
  t(key: string) {
    const s = this.store[this.getLocale()];
    if (!s) {
      return key;
    }

    return s[key] ?? key;
  }
}

export function useServerI18n() {
  const i18n = new I18nManager(getServerLocale());
  return i18n;
}

export const getServerI18n = useServerI18n;

export function useClientI18n() {
  const i18n = I18nManager.getInstance(getClientLocale);
  return i18n;
}
