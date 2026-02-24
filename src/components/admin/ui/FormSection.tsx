import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="bo-card animate-fade-in rounded-lg p-6">
      <div className="mb-4">
        <h3 className="font-serif text-xl text-[var(--color-text-primary)]">{title}</h3>
        {description && (
          <div className="body-text mt-1 text-sm text-gray-600">{description}</div>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
