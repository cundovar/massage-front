"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearTokenFromStorage } from "@/lib/auth";
import { NotificationBadge } from "@/components/ui/NotificationBadge";

const titleFromPath = (pathname: string): string => {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/pages")) return "Pages";
  if (pathname.startsWith("/admin/services")) return "Services";
  if (pathname.startsWith("/admin/media")) return "Mediatheque";
  if (pathname.startsWith("/admin/reservations")) return "Reservations";
  if (pathname.startsWith("/admin/settings")) return "Parametres";
  return "Backoffice";
};

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--bo-line)] bg-white/90 px-5 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-xl font-semibold">{titleFromPath(pathname)}</h1>
        <div className="flex items-center gap-3">
          <NotificationBadge count={0} />
          <button
            type="button"
            className="rounded-md border border-stone-300 px-3 py-1 text-sm"
            onClick={() => {
              clearTokenFromStorage();
              router.push("/admin/login");
            }}
          >
            Deconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
