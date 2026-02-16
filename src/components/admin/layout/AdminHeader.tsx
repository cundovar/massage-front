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
  <></>
  );
}
