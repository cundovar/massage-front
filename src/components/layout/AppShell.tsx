"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { SwipeMenu } from "@/components/layout/SwipeMenu";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { PageWrapper } from "@/components/transitions/PageWrapper";
import { FALLBACK_NAV } from "@/lib/defaultContent";
import type { NavItem } from "@/types/navigation";
import type { PublicSettings } from "@/types/settings";

interface AppShellProps {
  children: React.ReactNode;
  initialNavItems?: NavItem[];
  initialSettings?: PublicSettings;
}

export function AppShell({ children, initialNavItems, initialSettings }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [navItems, setNavItems] = useState<NavItem[]>(
    initialNavItems?.length ? initialNavItems : FALLBACK_NAV,
  );

  useEffect(() => {
    if (isAdmin) return;

    let cancelled = false;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

    (async () => {
      try {
        const response = await fetch(`${baseUrl}/api/navigation`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { items?: NavItem[] };
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setNavItems(data.items);
        }
      } catch {
        // Keep initial/fallback navigation if refresh fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  const showMobileToggle = initialSettings?.appearance?.showDarkModeToggle !== false;

  return (
    <TransitionProvider>
      <div className="min-h-screen overflow-x-hidden bg-transparent text-(--color-text-primary)">
        <Header initialNavItems={navItems} initialSettings={initialSettings} />
        <PageWrapper>
          <main className="pt-0 pb-24 sm:px-8 md:px-12 md:pb-8 lg:px-20 xl:pt-20">{children}</main>
        </PageWrapper>
        <Footer initialSettings={initialSettings} />
      </div>

      <BottomNav showThemeToggle={showMobileToggle} />
      <SwipeMenu initialNavItems={navItems} />
    </TransitionProvider>
  );
}
