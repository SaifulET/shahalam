import { NextResponse } from "next/server";

const GOOGLE_TRANSLATE_URL =
  "https://translate.googleapis.com/translate_a/single";
const DEFAULT_SOURCE_LANGUAGE = "auto";
const ARABIC_DIGITS = [
  "\u0660",
  "\u0661",
  "\u0662",
  "\u0663",
  "\u0664",
  "\u0665",
  "\u0666",
  "\u0667",
  "\u0668",
  "\u0669",
];
const LATIN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const requestCache = new Map<string, string>();

interface TranslateRequestBody {
  texts?: unknown;
  target?: unknown;
  source?: unknown;
}

function normalizeTexts(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean)
    )
  );
}

function toArabicDigits(value: string) {
  return value.replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);
}

function toLatinDigits(value: string) {
  return value.replace(/[\u0660-\u0669]/g, (digit) => {
    const index = ARABIC_DIGITS.indexOf(digit);
    return index >= 0 ? LATIN_DIGITS[index] : digit;
  });
}

function normalizeArabicPunctuation(value: string) {
  return value
    .replace(/,/g, "\u060C")
    .replace(/;/g, "\u061B")
    .replace(/\?/g, "\u061F");
}

function normalizeLatinPunctuation(value: string) {
  return value
    .replace(/\u060C/g, ",")
    .replace(/\u061B/g, ";")
    .replace(/\u061F/g, "?");
}

function formatForTarget(value: string, target: string) {
  if (target === "ar") {
    return normalizeArabicPunctuation(toArabicDigits(value));
  }
  if (target === "en") {
    return normalizeLatinPunctuation(toLatinDigits(value));
  }
  return value;
}

async function translateOne(
  text: string,
  target: string,
  source: string
): Promise<string> {
  const cacheKey = `${target}:${source}:${text}`;
  const cached = requestCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL(GOOGLE_TRANSLATE_URL);
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", source || DEFAULT_SOURCE_LANGUAGE);
    url.searchParams.set("tl", target);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    let response: Response;

    try {
      response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const fallback = formatForTarget(text, target);
      requestCache.set(cacheKey, fallback);
      return fallback;
    }

    const data = (await response.json()) as unknown;
    const chunks = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
    const translated = Array.isArray(chunks)
      ? chunks
          .map((chunk) =>
            Array.isArray(chunk) && typeof chunk[0] === "string"
              ? chunk[0]
              : ""
          )
          .join("")
      : "";

    const finalValue = formatForTarget(translated || text, target);
    requestCache.set(cacheKey, finalValue);
    return finalValue;
  } catch {
    const fallback = formatForTarget(text, target);
    requestCache.set(cacheKey, fallback);
    return fallback;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TranslateRequestBody;
    const texts = normalizeTexts(body?.texts);
    const target = typeof body?.target === "string" ? body.target.trim() : "";
    const source =
      typeof body?.source === "string" && body.source.trim()
        ? body.source.trim()
        : DEFAULT_SOURCE_LANGUAGE;

    if (!target) {
      return NextResponse.json(
        { success: false, message: "Target language is required" },
        { status: 400 }
      );
    }

    if (texts.length === 0) {
      return NextResponse.json({ success: true, translations: {} });
    }

    const translations: Record<string, string> = {};
    const translatedValues = await Promise.all(
      texts.map((text) => translateOne(text, target, source))
    );

    texts.forEach((text, index) => {
      translations[text] = translatedValues[index] ?? text;
    });

    return NextResponse.json({ success: true, translations });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to translate text" },
      { status: 500 }
    );
  }
}
