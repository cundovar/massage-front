"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TransitionProvider } from "@/context/TransitionContext";
import { PageWrapper } from "@/components/transitions/PageWrapper";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <TransitionProvider>
      <div className="min-h-screen overflow-x-hidden bg-(--color-background) text-(--color-text-primary)">
        <Header />
        <PageWrapper>
          <main className="pt-20 pb-8 px-4 sm:px-8 md:px-12 lg:px-20">{children}</main>
        </PageWrapper>
        {!isHome && <Footer />}
      </div>
    </TransitionProvider>
  );
}
