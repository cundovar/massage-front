import type { HTMLAttributes, PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement>>;

export function Badge({ children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`
        rounded-full
        border
        border-[var(--card-border)]
        bg-[var(--background-alt)]
        px-2 py-1
        text-xs
        text-[var(--text-secondary)]
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
