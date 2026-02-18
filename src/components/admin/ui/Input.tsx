import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full rounded-md border px-3 py-2 text-sm
          bg-white text-stone-900 placeholder-stone-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
          disabled:bg-stone-50 disabled:text-stone-500 disabled:cursor-not-allowed
          ${error
            ? "border-rose-500 focus:ring-rose-500"
            : "border-stone-200 hover:border-stone-300"
          }
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
