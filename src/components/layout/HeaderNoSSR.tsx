"use client";

import dynamic from "next/dynamic";
import type { NavItem } from "@/types/navigation";

const HeaderClient = dynamic(() => import("@/components/layout/Header").then((module) => module.Header), {
  ssr: false,
});

interface HeaderNoSSRProps {
  initialNavItems?: NavItem[];
}

export function HeaderNoSSR({ initialNavItems }: HeaderNoSSRProps) {
  return <HeaderClient initialNavItems={initialNavItems} />;
}
