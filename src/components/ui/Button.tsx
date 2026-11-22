import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  target,
  rel,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 select-none text-center";

  const variantStyles = {
    primary:
      "bg-stone-900 text-stone-100 hover:bg-stone-800 active:bg-black border border-stone-900 shadow-sm",
    secondary:
      "bg-stone-100 text-stone-900 hover:bg-stone-200 active:bg-stone-300 border border-stone-200",
    outline:
      "border border-stone-300 text-stone-800 hover:border-stone-900 hover:text-stone-950 bg-transparent",
    gold:
      "bg-[#B58D54] text-white hover:bg-[#A37B43] active:bg-[#8F6B38] border border-[#B58D54]",
    ghost:
      "text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-transparent",
  };

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 uppercase tracking-wider",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  const combinedClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    if (href.startsWith("http") || href.startsWith("https://wa.me") || href.startsWith("tel:")) {
      return (
        <a
          href={href}
          target={target || (href.startsWith("http") ? "_blank" : undefined)}
          rel={rel || (href.startsWith("http") ? "noopener noreferrer" : undefined)}
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
