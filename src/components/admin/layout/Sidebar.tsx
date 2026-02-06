"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bo-sidebar fixed inset-y-0 left-0 hidden w-64 flex-col p-5 lg:flex">
      <p className="text-2xl leading-none text-amber-300">Helene</p>
      <p className="mt-1 text-xs tracking-[0.18em] text-stone-400 uppercase">Backoffice</p>

      <nav className="mt-8 space-y-1" aria-label="Navigation admin">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                active
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-stone-300 hover:bg-white/5 hover:text-amber-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
