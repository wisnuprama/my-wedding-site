import Link, { LinkProps } from "next/link";
import { DoubleUnderline } from "./DoubleUnderline";

export type PrimaryLinkProps = LinkProps & { children: React.ReactNode };

export function PrimaryLink(props: PrimaryLinkProps) {
  const { children, ...restProps } = props;

  return (
    <Link {...restProps} className="uppercase text-xl mt-4 drop-shadow-md">
      {props.children}
      <DoubleUnderline />
    </Link>
  );
}
