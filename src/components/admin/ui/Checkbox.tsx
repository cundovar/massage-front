import { forwardRef, type InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="
            h-4 w-4 rounded border-stone-300
            text-amber-500
            focus:ring-amber-500 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          {...props}
        />
        {label && <span className="text-sm text-stone-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
