import type { Metadata } from "next";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export const metadata: Metadata = {
  icons: [{ url: "/favicon-admin.svg", type: "image/svg+xml" }],
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
