import Image, { StaticImageData } from "next/image";

type PersonInfoProps = {
  name: string;
  subtitle: string;
  description: string;

  imageSrc: StaticImageData | string;

  containerClassName?: string;
};

const imageStyle = {
  minHeight: 120,
  minWidth: 120,
  height: "calc(100vh * 0.2)",
  width: "calc(100vh * 0.2)",
} as const;

export function PersonInfo(props: PersonInfoProps) {
  const {
    name,
    subtitle,
    description,
    imageSrc,
    containerClassName = "",
  } = props;
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${containerClassName}`}
    >
      <Image
        src={imageSrc}
        width={140}
        height={140}
        loading="lazy"
        alt={[name, subtitle, description].join(" ")}
        className="rounded-full object-cover aspect-square"
        style={imageStyle}
        placeholder="blur"
      />
      <h2 className="text-2xl mt-2">{name}</h2>
      <p className="mt-1">
        {subtitle}
        <br />
        {description}
      </p>
    </div>
  );
}
