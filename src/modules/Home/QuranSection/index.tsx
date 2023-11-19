import { useServerI18n } from "@/core/i18n";

export function QuranSection() {
  const i18n = useServerI18n();

  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl underline underline-offset-8">
        {i18n.t("title_quran_section")}
      </h1>
      <div className="flex flex-col mt-16 px-4 md:px-24 max-w-screen-lg text-center">
        <p>{i18n.t("quran_ar_rum_30_12")}</p>
        <p className="mt-12">{i18n.t("quran_ar_rum_30_12_translation")}</p>
      </div>
    </section>
  );
}
