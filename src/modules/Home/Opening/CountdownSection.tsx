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

  const formatter = new Intl.DateTimeFormat(i18n.getLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      className="flex flex-col justify-end items-center pb-8"
      style={containerStyle}
    >
      <p className="text-xl">
        {formatter.format(config.WEDDING_DAY_TIMESTAMP * 1000)}
      </p>
      <h2 className={`mt-5 text-3xl ${fontCursive.className}`}>
        {i18n.t("label_counting_down")}
      </h2>
      <div className="mt-5 pb-7 px-3 w-full md:max-w-screen-md">
        <Countdown deadline={config.WEDDING_DAY_TIMESTAMP} />
      </div>
    </section>
  );
}
