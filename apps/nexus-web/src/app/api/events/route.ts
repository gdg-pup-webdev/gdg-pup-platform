import { NextRequest, NextResponse } from "next/server";

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export async function GET(request: NextRequest) {
  const baseUrl = trimTrailingSlash(
    process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000",
  );

  const query = request.nextUrl.searchParams.toString();
  const suffix = query ? `?${query}` : "";

  const candidatePaths = [
    `/api/event-system/events${suffix}`,
    `/api/v0/event-system/events${suffix}`,
  ];

  const failures: Array<{ path: string; detail: string }> = [];

  for (const path of candidatePaths) {
    const url = `${baseUrl}${path}`;
    try {
      const response = await fetch(url, { method: "GET" });
      const contentType = response.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.ok) {
        return NextResponse.json(body, { status: response.status });
      }

      failures.push({
        path,
        detail:
          typeof body === "string"
            ? body
            : body?.message || `HTTP ${response.status}`,
      });
    } catch (error) {
      failures.push({
        path,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return NextResponse.json(
    {
      status: "error",
      message: "Failed to fetch events from Nexus API.",
      errors: failures.map((f) => ({
        title: "Upstream Error",
        detail: `${f.path}: ${f.detail}`,
      })),
    },
    { status: 502 },
  );
}

