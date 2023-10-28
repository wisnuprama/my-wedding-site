import { useServerI18n } from "@/core/i18n";

export function CountdownSection() {
  const i18n = useServerI18n();

  return (
    <section id="pg-2" className="h-screen flex flex-col justify-end pb-8">
      <div className="flex flex-col items-center">
        <div className="text-xl">{i18n.t("label_wedding_date")}</div>
        <div className="mt-4">{i18n.t("title_countdown_section")}</div>
        <div
          className="mt-3 p-3 bg-red-400 w-full"
          style={{ height: "5rem" }}
        ></div>
      </div>
    </section>
  );
}
