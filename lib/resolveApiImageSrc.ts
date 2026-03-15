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

export function resolveExportImageSrc(imagePath?: string | null) {
  const resolvedSrc = resolveApiImageSrc(imagePath);
  if (!resolvedSrc) return null;

  if (
    resolvedSrc.startsWith("data:") ||
    resolvedSrc.startsWith("blob:")
  ) {
    return resolvedSrc;
  }

  try {
    const baseOrigin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const absoluteUrl = new URL(resolvedSrc, baseOrigin);

    if (absoluteUrl.origin === baseOrigin) {
      return absoluteUrl.toString();
    }

    return `/api/image-proxy?src=${encodeURIComponent(absoluteUrl.toString())}`;
  } catch {
    return resolvedSrc;
  }
}
