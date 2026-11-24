"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/** Keep pointer targets stationary; their native hover and focus feedback remain. */
export function Magnetic({ children, className }: MagneticProps) {
  return <div className={cn("inline-flex", className)}>{children}</div>;
}
