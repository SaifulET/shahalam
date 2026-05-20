import { NextRequest, NextResponse } from "next/server";

const FALLBACK_API_BASE_URL = "https://api.ur-wsl.com";

function isApiImageUrl(imageUrl: URL) {
  try {
    const apiBaseUrl = new URL(process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_BASE_URL);
    return imageUrl.origin === apiBaseUrl.origin;
  } catch {
    return imageUrl.origin === FALLBACK_API_BASE_URL;
  }
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");

  if (!src) {
    return NextResponse.json({ error: "Missing src parameter" }, { status: 400 });
  }

  let imageUrl: URL;

  try {
    imageUrl = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid src parameter" }, { status: 400 });
  }

  if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Unsupported protocol" }, { status: 400 });
  }

  try {
    const headers = new Headers({
      Accept: "image/*,*/*;q=0.8",
    });
    if (isApiImageUrl(imageUrl)) {
      const authorization = request.headers.get("authorization");
      const cookie = request.headers.get("cookie");

      if (authorization) {
        headers.set("Authorization", authorization);
      }
      if (cookie) {
        headers.set("Cookie", cookie);
      }
    }

    const response = await fetch(imageUrl.toString(), {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 });
  }
}
