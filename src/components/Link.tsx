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
      className={`uppercase drop-shadow-md hover:bg-white hover:bg-opacity-50 cursor-pointer ${props.className}`}
    >
      {props.children}
      <DoubleUnderline />
    </Link>
  );
}

export function PrimaryAnchor(props: HTMLProps<HTMLAnchorElement>) {
  const { children, ...restProps } = props;

  return (
    <a
      {...restProps}
      className={`uppercase drop-shadow-md hover:bg-white hover:bg-opacity-50 cursor-pointer ${props.className}`}
    >
      {props.children}
      <DoubleUnderline />
    </a>
  );
}

export type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`uppercase drop-shadow-md hover:bg-white hover:bg-opacity-50 cursor-pointer ${props.className}`}
    >
      {props.children}
      <DoubleUnderline />
    </button>
  );
}

export function IcLink(props: PrimaryLinkProps) {
  const { children, ...restProps } = props;
  return (
    <Link
      {...restProps}
      className={`flex justify-center items-center drop-shadow-md rounded-full p-1 w-10 h-10 cursor-pointer backdrop-blur-sm hover:bg-opacity-60 active:bg-white active:bg-opacity-5 ${props.className}`}
    >
      {props.children}
    </Link>
  );
}

export function IcButton(props: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`flex justify-center items-center drop-shadow-md rounded-full p-1 w-10 h-10 cursor-pointer backdrop-blur-sm hover:bg-opacity-60 active:bg-white active:bg-opacity-5 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
