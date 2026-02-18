import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, padding = "md", className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-lg border border-stone-200
        bg-gradient-to-br from-white to-stone-50
        shadow-sm
        ${paddingStyles[padding]}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
