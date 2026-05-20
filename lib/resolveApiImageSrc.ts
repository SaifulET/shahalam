const FALLBACK_API_BASE_URL = "https://api.ur-wsl.com";

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_BASE_URL).replace(/\/+$/, "");
}

function getCurrentOrigin() {
  return typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
}

function uniqueValues(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

function isLocalPublicAsset(value: string) {
  return /^\/(alart|authbg|bg|folder|hero|instagram|logo|rc[1-3])\.(svg|jpg|jpeg|png|webp)$/i.test(
    value
  );
}

function getImagePathValue(imagePath?: string | null) {
  if (!imagePath) return null;

  const value = imagePath.trim().replace(/\\/g, "/");
  return value || null;
}

export function resolveApiImageSrcCandidates(imagePath?: string | null) {
  const value = getImagePathValue(imagePath);
  if (!value) return [];

  if (value.startsWith("data:") || value.startsWith("blob:")) return [value];
  if (/^https?:\/\//i.test(value)) return [value];

  const apiBaseUrl = getApiBaseUrl();

  if (value.startsWith("/")) {
    if (isLocalPublicAsset(value)) return [value];

    const withoutLeadingSlash = value.replace(/^\/+/, "");
    const withoutApiPrefix = withoutLeadingSlash.replace(/^api\//i, "");

    return uniqueValues([
      `${apiBaseUrl}/${withoutLeadingSlash}`,
      `${apiBaseUrl}/${withoutApiPrefix}`,
      value,
    ]);
  }

  return uniqueValues([
    `${apiBaseUrl}/${value.replace(/^\/+/, "")}`,
    `/${value.replace(/^\/+/, "")}`,
  ]);
}

export function resolveApiImageSrc(imagePath?: string | null) {
  return resolveApiImageSrcCandidates(imagePath)[0] ?? null;
}

export function resolveExportImageSrc(imagePath?: string | null) {
  return resolveExportImageSrcCandidates(imagePath)[0] ?? null;
}

function resolveExportCandidatesForSrc(src: string) {
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return [src];
  }

  try {
    const baseOrigin = getCurrentOrigin();
    const apiBaseUrl = getApiBaseUrl();
    const absoluteUrl = new URL(src, baseOrigin);
    const nextProxyUrl = `${baseOrigin}/api/image-proxy?src=${encodeURIComponent(
      absoluteUrl.toString()
    )}`;
    const backendProxyUrl = `${apiBaseUrl}/image-proxy?src=${encodeURIComponent(
      absoluteUrl.toString()
    )}`;

    if (absoluteUrl.origin === baseOrigin) {
      return [absoluteUrl.toString()];
    }

    return uniqueValues([
      nextProxyUrl,
      backendProxyUrl,
      absoluteUrl.toString(),
    ]);
  } catch {
    return [src];
  }
}

export function resolveExportImageSrcCandidates(imagePath?: string | null) {
  return uniqueValues(
    resolveApiImageSrcCandidates(imagePath).flatMap(resolveExportCandidatesForSrc)
  );
}
