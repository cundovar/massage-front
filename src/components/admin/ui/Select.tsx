import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className = "", ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          w-full rounded-md border px-3 py-2 text-sm
          bg-white text-stone-900
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
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";
