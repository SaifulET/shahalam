import { create } from "zustand";

type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  phone?: string;
  profileImage?: string;
  location?: string;
  website?: string;
  instagramLink?: string;
  description?: string;
};

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,

  login: (user, token) =>
    set({ user, accessToken: token, isAuthenticated: true, loading: false }),

  logout: () =>
    set({ user: null, accessToken: null, isAuthenticated: false, loading: false }),

  setAccessToken: (token) => set({ accessToken: token }),
}));
