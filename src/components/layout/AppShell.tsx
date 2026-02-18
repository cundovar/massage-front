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
      <div className="min-h-screen bg-(--color-background) text-(--color-text-primary)">
        <Header />
        <PageWrapper>
          <main className="mt-20 mr-20 ml-20 max-md:m-1 min-lg:p-20 bg-amber-500">{children}</main>
        </PageWrapper>
        <Footer />
      </div>
    </TransitionProvider>
  );
}
