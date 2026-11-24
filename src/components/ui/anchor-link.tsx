"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useScrollTo } from "@/lib/use-scroll-to";

type AnchorLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/** Lenis-aware in-page hash link that preserves native modifier clicks and SSR markup. */
export function AnchorLink({ href, onClick, children, ...props }: AnchorLinkProps) {
  const scrollTo = useScrollTo();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      !href.startsWith("#") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    scrollTo(href);
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
