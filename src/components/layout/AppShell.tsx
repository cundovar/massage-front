"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { TransitionProvider } from "@/context/TransitionContext";
import { PageWrapper } from "@/components/transitions/PageWrapper";
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

  if (isAdmin) {
    return <>{children}</>;
  }

  const showMobileToggle = initialSettings?.appearance?.showDarkModeToggle !== false;

  return (
    <TransitionProvider>
      <div className="min-h-screen overflow-x-hidden bg-(--color-background) text-(--color-text-primary)">
        <Header initialNavItems={initialNavItems} initialSettings={initialSettings} />
        <PageWrapper>
          <main className="px-4 pt-0 pb-24 sm:px-8 md:px-12 md:pb-8 lg:px-20 xl:pt-20">{children}</main>
        </PageWrapper>
        <Footer initialSettings={initialSettings} />
      </div>

      <BottomNav showThemeToggle={showMobileToggle} />
    </TransitionProvider>
  );
}
