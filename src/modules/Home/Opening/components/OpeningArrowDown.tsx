"use client";
import React, { useCallback, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { DisableScrollContext } from "@/modules/DisableScroll/context";
import "./OpeningArrowDown.css";

export function OpeningArrowDown() {
  const { enableScroll } = useContext(DisableScrollContext);

  const handleLink = useCallback(() => enableScroll(), [enableScroll]);

  return (
    <Link href="#pg-2" onClick={handleLink} className="opening-arrow-down">
      <Image
        src="/images/ic_arrow_down.png"
        alt="Go to next section"
        width={48}
        height={30}
        className="object-cover drop-shadow pointer-events-none"
        priority
      />
    </Link>
  );
}
