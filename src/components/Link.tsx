import Link, { LinkProps } from "next/link";
import { DoubleUnderline } from "./DoubleUnderline";
import { ButtonHTMLAttributes, HTMLProps } from "react";

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

export type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`uppercase drop-shadow-md ${props.className}`}
    >
      {props.children}
      <DoubleUnderline />
    </button>
  );
}
