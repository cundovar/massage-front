import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`rounded bg-black px-4 py-2 text-white ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
