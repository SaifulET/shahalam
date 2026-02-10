import { create } from "zustand";

type ForgotPasswordState = {
  email: string;
  otpVerified: boolean;

  setEmail: (email: string) => void;
  setOtpVerified: (value: boolean) => void;
  reset: () => void;
};

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  email: "",
  otpVerified: false,

  setEmail: (email) => set({ email }),
  setOtpVerified: (value) => set({ otpVerified: value }),
  reset: () => set({ email: "", otpVerified: false }),
}));
