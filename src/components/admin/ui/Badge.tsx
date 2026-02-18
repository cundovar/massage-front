import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5
      rounded-full text-xs font-medium
      ${variantStyles[variant]}
    `}>
      {children}
    </span>
  );
}
