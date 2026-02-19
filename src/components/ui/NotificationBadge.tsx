interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  return (
    <span
      className="inline-flex min-w-6 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold"
      style={{
        background: "color-mix(in srgb, var(--primary-start) 20%, transparent)",
        color: "var(--primary-start)",
      }}
    >
      {count}
    </span>
  );
}
