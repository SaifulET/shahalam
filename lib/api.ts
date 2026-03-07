import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, type AppLocale } from "./i18n";


const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.ur-wsl.com",
  baseURL: "http://localhost:5001",

  withCredentials: true, // send httpOnly cookie
});

const getEffectiveLocale = (): AppLocale => {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const cookieValue = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split("=")[1];

  return cookieValue === "ar" || cookieValue === "en"
    ? cookieValue
    : DEFAULT_LOCALE;
};

// Attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const locale = getEffectiveLocale();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.headers) {
    config.headers["Accept-Language"] = locale;
    config.headers["x-language"] = locale;
  }

  if (!config.params) {
    config.params = {};
  }
  if (!Object.prototype.hasOwnProperty.call(config.params, "lang")) {
    config.params.lang = locale;
  }

  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh"); // refresh token endpoint
        const { accessToken } = res.data;
        useAuthStore.getState().setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // retry original request
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
