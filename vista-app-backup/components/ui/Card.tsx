import { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Левая акцентная полоска (бренд) */
  accent?: boolean;
}

export default function Card({ accent = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden
        ${accent ? "border-l-4 border-l-[var(--accent)]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-slate-200 px-4 py-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
}
