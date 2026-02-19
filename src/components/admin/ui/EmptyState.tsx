import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in text-center py-12">
      {icon && (
        <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl text-[var(--color-text-primary)]">{title}</h3>
      {description && (
        <p className="body-text mx-auto mt-2 max-w-sm text-sm text-gray-600">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
