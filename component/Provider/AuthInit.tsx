"use client";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";


export default function AuthInit() {
  const setAuth = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/auth")) {
      setLoading();
      return;
    }

    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh");
        const { accessToken, user } = res.data;
        setAuth(user, accessToken);
      } catch {
        setLoading();
      }
    };
    initAuth();
  }, [pathname, setAuth, setLoading]);

  return null;
}
