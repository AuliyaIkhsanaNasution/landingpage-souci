import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * GET /api/news/latest/[count]
 * Get latest news articles
 */
export async function GET(req, { params }) {
  try {
    const { count: countParam } = await params;
    const count = parseInt(countParam) || 3;

    const [news] = await db.query(
      'SELECT * FROM news WHERE status = "published" ORDER BY published_at DESC LIMIT ?',
      [count]
    );

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching latest news",
      },
      { status: 500 }
    );
  }
}
