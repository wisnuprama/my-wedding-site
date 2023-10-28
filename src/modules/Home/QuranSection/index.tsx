import { useServerI18n } from "@/core/i18n";

export function QuranSection() {
  const i18n = useServerI18n();

  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <div className="text-xl">{i18n.t("title_quran_section")}</div>
      <div className="flex flex-col mt-16 px-4 text-center">
        <p>{i18n.t("quran_ar_rum_30_12")}</p>
        <p className="mt-10">{i18n.t("quran_ar_rum_30_12_translation")}</p>
      </div>
    </section>
  );
}
