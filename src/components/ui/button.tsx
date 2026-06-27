import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
  ariaLabel?: string;
};

export function Button({ href, children, variant = "primary", className = "", ariaLabel }: ButtonProps) {
  const styles = {
    primary: "bg-brand-gradient text-white shadow-[0_12px_30px_rgba(91,33,232,0.22)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(91,33,232,0.3)]",
    secondary: "border border-brand-blue/25 bg-white text-brand-navy hover:border-brand-purple/50 hover:bg-brand-lavender/40",
    light: "bg-white text-brand-navy hover:-translate-y-0.5 hover:bg-brand-soft",
  };

  return (
    <Link aria-label={ariaLabel} href={href} className={`motion-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300 ${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
