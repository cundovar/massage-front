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

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <TransitionProvider>
      <div className="fixed-background" aria-hidden="true" />
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <Header />
        <PageWrapper>
          <main className="pr-20 pl-20">{children}</main>
        </PageWrapper>
        <Footer />
      </div>
    </TransitionProvider>
  );
}
