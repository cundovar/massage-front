import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "ghost";
  className?: string;
}

export function Button({ children, className = "", variant = "filled", ...props }: ButtonProps) {
  const baseStyles = "rounded px-4 py-2 transition-all duration-300 ease-in-out font-medium";

  const variantStyles = {
    filled: "bg-gold-start text-brown-darker shadow-md shadow-gold-dark/30 hover:bg-gold-end",
    ghost: "border border-gold-start text-gold-start bg-transparent hover:bg-gold-start/10",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
