import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/openalex";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
  }

  try {
    const paper = await getPaperById(id);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json(paper);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch paper", detail: String(e) },
      { status: 500 }
    );
  }
}
