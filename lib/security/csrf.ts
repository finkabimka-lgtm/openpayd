import { NextResponse } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function rejectCrossSiteMutation(request: Request) {
  if (SAFE_METHODS.has(request.method)) {
    return null;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  const requestUrl = new URL(request.url);
  if (origin !== requestUrl.origin) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  }

  return null;
}
