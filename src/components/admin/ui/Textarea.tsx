import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-md border px-3 py-2 text-sm
          bg-white text-stone-900 placeholder-stone-400
          transition-colors duration-200 resize-vertical
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

Textarea.displayName = "Textarea";
