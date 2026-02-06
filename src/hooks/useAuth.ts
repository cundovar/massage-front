"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";

export function useAuth(redirectTo = "/admin/login") {
  const router = useRouter();
  const [token] = useState<string | null>(() => getTokenFromStorage());

  useEffect(() => {
    if (!token) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, token]);

  function logout() {
    clearTokenFromStorage();
    router.push(redirectTo);
  }

  return { token, logout };
}
