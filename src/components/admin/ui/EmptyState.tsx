import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto w-12 h-12 text-stone-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-stone-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
