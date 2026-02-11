import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gold-light/20 bg-sand-light/20 backdrop-blur-sm shadow-lg shadow-brown-deep/10 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
