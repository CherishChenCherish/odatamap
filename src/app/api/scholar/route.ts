import { NextRequest, NextResponse } from "next/server";
import { getAuthorById } from "@/lib/openalex";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
  }

  try {
    const author = await getAuthorById(id);
    if (!author) {
      return NextResponse.json({ error: "Scholar not found" }, { status: 404 });
    }
    return NextResponse.json(author);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch scholar", detail: String(e) },
      { status: 500 }
    );
  }
}
