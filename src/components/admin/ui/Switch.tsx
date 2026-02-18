import { forwardRef, type InputHTMLAttributes } from "react";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, checked, className = "", ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div className="
            w-11 h-6 rounded-full
            bg-stone-200
            peer-checked:bg-amber-500
            peer-focus:ring-2 peer-focus:ring-amber-500 peer-focus:ring-offset-2
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            transition-colors duration-200
          " />
          <div className="
            absolute left-0.5 top-0.5
            w-5 h-5 rounded-full bg-white shadow
            peer-checked:translate-x-5
            transition-transform duration-200
          " />
        </div>
        {label && <span className="text-sm text-stone-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";
