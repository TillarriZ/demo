"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:opacity-90 focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-2 focus:ring-slate-200 focus:ring-offset-2",
  danger:
    "bg-[var(--risk-red)] text-white hover:opacity-90 focus:ring-2 focus:ring-[var(--risk-red)] focus:ring-offset-2",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[32px]",
  md: "px-4 py-2 text-sm font-medium min-h-[40px]",
  lg: "px-6 py-3 text-base font-medium min-h-[44px]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  leftIcon,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
      ) : leftIcon ? (
        <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{leftIcon}</span>
      ) : null}
      {children}
    </button>
  );
}
