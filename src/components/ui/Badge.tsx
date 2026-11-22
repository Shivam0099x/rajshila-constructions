import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "outline" | "stone";
  className?: string;
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  className,
  size = "md",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-stone-100 text-stone-800 border-stone-200",
    stone: "bg-stone-900 text-stone-200 border-stone-700",
    gold: "bg-amber-50 text-amber-900 border-amber-200/80",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
    warning: "bg-amber-100 text-amber-950 border-amber-300",
    outline: "bg-transparent text-stone-700 border-stone-300",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
    md: "px-3 py-1 text-xs font-medium tracking-wider uppercase",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
