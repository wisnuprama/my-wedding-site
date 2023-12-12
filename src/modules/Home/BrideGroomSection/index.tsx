import { fontCursive } from "@/core/styles";
import { PersonInfo } from "./components/PersonInfo";
import { useServerI18n } from "@/core/i18n";

export function BrideGroomSection() {
  const i18n = useServerI18n();
  return (
    <section className="min-h-screen px-8 py-24 md:flex md:flex-col">
      <h1
        className={`text-4xl sm:text-5xl ${fontCursive.className} text-center`}
      >
        {i18n.t("title_bride_and_groom")}
      </h1>
      <div className="h-full w-full md:flex md:flex-row md:justify-evenly md:flex-1">
        <PersonInfo
          imageSrc="/assets/images/bride-20231211-3.jpeg"
          name={i18n.t("label_name_of_the_bride")}
          subtitle={i18n.t("label_daughter")}
          description={i18n.t("label_bride_parents")}
          containerClassName="mt-14 md:mt-14"
        />
        <PersonInfo
          imageSrc="/assets/images/groom-20231211-3.jpeg"
          name={i18n.t("label_the_groom")}
          subtitle={i18n.t("label_son")}
          description={i18n.t("Label_groom_parents")}
          containerClassName="mt-20 md:mt-14"
        />
      </div>
    </section>
  );
}
