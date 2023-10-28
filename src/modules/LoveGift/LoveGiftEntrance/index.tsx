import { fontCursive } from "@/app/layout";
import { PrimaryLink } from "@/components/Link";
import { useServerI18n } from "@/core/i18n";

export function LoveGiftEntrance() {
  const i18n = useServerI18n();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1
        className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className}`}
      >
        {i18n.t("title_love_gift")}
      </h1>
      <div className="flex flex-col mt-8 px-8 text-center">
        <p>{i18n.t("label_love_gift_quote")}</p>
      </div>
      <PrimaryLink href="/wedding-gift" className="mt-8 ">
        {i18n.t("label_click_account")}
      </PrimaryLink>
      <div className="h-1/5" />
    </div>
  );
}
