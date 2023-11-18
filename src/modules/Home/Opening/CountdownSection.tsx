import { useServerI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import { Countdown } from "./components/Countdown";
import config from "@/core/config";

type CountdownSectionProps = {
  containerStyle?: React.CSSProperties;
};

export function CountdownSection(props: CountdownSectionProps) {
  const { containerStyle } = props;
  const i18n = useServerI18n();

  return (
    <section
      className="flex flex-col justify-end items-center pb-8"
      style={containerStyle}
    >
      <div className="text-xl">{i18n.t("label_wedding_date")}</div>
      <h2 className={`mt-4 text-3xl ${fontCursive.className}`}>
        {i18n.t("label_counting_down")}
      </h2>
      <div className="mt-5 p-3 w-full md:max-w-screen-md">
        <Countdown deadline={config.WEDDING_DAY_TIMESTAMP} />
      </div>
    </section>
  );
}
