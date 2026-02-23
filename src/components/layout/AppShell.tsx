"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

  return (
    <TransitionProvider>
      <div className="min-h-screen overflow-x-hidden bg-(--color-background) text-(--color-text-primary)">
        <Header initialNavItems={initialNavItems} initialSettings={initialSettings} />
        <PageWrapper>
          <main className="xl:pt-20 pb-8 px-4 sm:px-8 md:px-12 lg:px-20">{children}</main>
        </PageWrapper>
        <Footer initialSettings={initialSettings} />
      </div>
    </TransitionProvider>
  );
}
