"use client";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";


export default function AuthInit() {
  const setAuth = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.logout);

  useEffect(() => {
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
  }, []);

  return null;
}
