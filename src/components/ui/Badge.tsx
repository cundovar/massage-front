import type { PropsWithChildren } from "react";

export function Badge({ children }: PropsWithChildren) {
  return <span className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700">{children}</span>;
}
