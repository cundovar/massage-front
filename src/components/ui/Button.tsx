import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`
        rounded-[var(--btn-radius)]
        border border-[var(--btn-border)]
        px-4 py-2
        text-[var(--btn-text)]
        transition-all
        hover:opacity-90
        ${className}
      `.trim()}
      style={{ background: "var(--btn-bg)" }}
      {...props}
    >
      {children}
    </button>
  );
}
