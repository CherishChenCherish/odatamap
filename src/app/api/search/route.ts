import { NextRequest, NextResponse } from "next/server";
import { searchPapers, searchAuthors } from "@/lib/openalex";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const type = req.nextUrl.searchParams.get("type") || "papers";
  const page = Number(req.nextUrl.searchParams.get("page") || "1");

  if (!q) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    if (type === "authors") {
      const result = await searchAuthors(q, page, 10);
      return NextResponse.json(result);
    } else {
      const result = await searchPapers(q, page, 10);
      return NextResponse.json(result);
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to search", detail: String(e) },
      { status: 500 }
    );
  }
}
