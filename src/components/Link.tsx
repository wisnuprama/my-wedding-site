import Link, { LinkProps } from "next/link";
import { DoubleUnderline } from "./DoubleUnderline";

export type PrimaryLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export function PrimaryLink(props: PrimaryLinkProps) {
  const { children, ...restProps } = props;

  return (
    <Link
      {...restProps}
      className={`uppercase drop-shadow-md ${props.className}`}
    >
      {props.children}
      <DoubleUnderline />
    </Link>
  );
}
