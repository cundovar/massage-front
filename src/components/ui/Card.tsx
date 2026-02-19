import type { HTMLAttributes, PropsWithChildren } from "react";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        border
        border-[var(--card-border)]
        bg-[var(--card-bg)]
        rounded-[var(--card-radius)]
        p-4
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
