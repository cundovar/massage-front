import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="bo-card animate-fade-in rounded-lg p-6">
      <div className="mb-4">
        <h3 className="font-serif text-xl text-[var(--color-text-primary)]">{title}</h3>
        {description && (
          <p className="body-text mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
