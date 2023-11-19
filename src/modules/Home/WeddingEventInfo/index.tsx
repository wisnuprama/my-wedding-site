import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";

export type WeddingEventInfoProps = {};

export function WeddingEventInfo(_: WeddingEventInfoProps) {
  const i18n = useServerI18n();
  return (
    <section className="h-screen px-8 py-24 md:flex md:flex-col">
      <h1
        className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className} text-center`}
      >
        {i18n.t("title_event_akad")}
      </h1>
    </section>
  );
}
