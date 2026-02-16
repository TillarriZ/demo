import { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "risk-high" | "risk-medium" | "risk-low";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-200 text-slate-700",
  success: "bg-[var(--accent-light)] text-[var(--accent)]",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-[var(--risk-red)]",
  "risk-high": "bg-red-100 text-[var(--risk-red)] font-medium",
  "risk-medium": "bg-amber-100 text-[var(--risk-orange)] font-medium",
  "risk-low": "bg-slate-100 text-slate-600",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs
        ${variantStyles[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
