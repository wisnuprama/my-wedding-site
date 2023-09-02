"use client";
import { useLayoutEffect, useRef } from "react";
import "./styles.css";

export function MobileFadeOut(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current != null) {
      ref.current.classList.toggle("fade");
    }
  }, []);

  return (
    <div ref={ref} className={["fade-out", props.className].join(" ")}>
      {props.children}
    </div>
  );
}
