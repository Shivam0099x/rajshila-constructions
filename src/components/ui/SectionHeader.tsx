import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-block text-xs font-semibold uppercase tracking-[0.25em] mb-3",
            dark ? "text-amber-400/90" : "text-amber-700/90"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight",
          dark ? "text-stone-100" : "text-stone-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg font-normal leading-relaxed",
            dark ? "text-stone-400" : "text-stone-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
