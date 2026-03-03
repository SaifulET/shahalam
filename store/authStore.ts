import { create } from "zustand";
import { persist } from "zustand/middleware";

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
} & Record<string, unknown>;

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,

      login: (user, token) => {
        set((state) => {
          const previousUser = state.user ?? ({} as User);
          const userRecord = user as Record<string, unknown>;
          const previousRecord = previousUser as Record<string, unknown>;

          const normalizedId =
            user.id ||
            (typeof userRecord._id === "string" ? userRecord._id : previousUser.id || "");

          const normalizedInstagramLink =
            (typeof user.instagramLink === "string" && user.instagramLink.trim()) ||
            (typeof userRecord.instagramlink === "string" && userRecord.instagramlink.trim()) ||
            (typeof userRecord.instagram_link === "string" && userRecord.instagram_link.trim()) ||
            (typeof previousUser.instagramLink === "string" && previousUser.instagramLink.trim()) ||
            (typeof previousRecord.instagramlink === "string" && previousRecord.instagramlink.trim()) ||
            "";

          return {
            user: {
              ...previousUser,
              ...user,
              id: normalizedId,
              instagramLink: normalizedInstagramLink || undefined,
            },
            accessToken: token,
            isAuthenticated: true,
            loading: false,
          };
        });
      },

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false, loading: false }),

      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      // Optional: specify which fields to persist
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
