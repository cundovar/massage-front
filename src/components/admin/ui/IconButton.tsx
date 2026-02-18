import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type IconButtonVariant = "default" | "danger" | "ghost";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: "sm" | "md";
  label: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
  danger: "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
  ghost: "text-stone-400 hover:bg-stone-100 hover:text-stone-600",
};

const sizeStyles = {
  sm: "p-1",
  md: "p-2",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "default", size = "md", label, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={`
          inline-flex items-center justify-center
          rounded-md transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
