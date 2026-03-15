const FALLBACK_API_BASE_URL = "http://localhost:5001";

export function resolveApiImageSrc(imagePath?: string | null) {
  if (!imagePath) return null;

  const value = imagePath.trim();
  if (!value) return null;

  if (value.startsWith("data:") || value.startsWith("blob:")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return value;

  const apiBaseUrl = (
    process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_BASE_URL
  ).replace(/\/+$/, "");

  return `${apiBaseUrl}/${value.replace(/^\/+/, "")}`;
}
