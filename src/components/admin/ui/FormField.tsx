import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-stone-600"
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-stone-500">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
}
