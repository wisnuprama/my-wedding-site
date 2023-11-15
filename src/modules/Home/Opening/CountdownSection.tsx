import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { Countdown } from "./components/Countdown";
import config from "@/core/config";

export function CountdownSection() {
  const i18n = useServerI18n();

  return (
    <section id="pg-2" className="h-screen flex flex-col justify-end pb-8">
      <div className="flex flex-col items-center">
        <div className="text-xl">{i18n.t("label_wedding_date")}</div>
        <h2 className={`mt-4 text-3xl ${fontCursive.className}`}>
          {i18n.t("label_counting_down")}
        </h2>
        <div className="mt-5 p-3 w-full md:max-w-screen-md">
          <Countdown deadline={config.WEDDING_DAY_TIMESTAMP} />
        </div>
      </div>
    </section>
  );
}
