import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * POST /api/news/[slug]/view
 * Increment view count untuk artikel
 */
export async function POST(req, { params }) {
  try {
    const { slug } = await params;

    // Check if slug is numeric (id) or string (slug)
    const isId = !isNaN(slug);
    
    if (isId) {
      await db.query("UPDATE news SET views = views + 1 WHERE id = ?", [slug]);
    } else {
      await db.query("UPDATE news SET views = views + 1 WHERE slug = ?", [slug]);
    }

    return NextResponse.json({
      success: true,
      message: "View count incremented",
    });
  } catch (error) {
    console.error("Error incrementing view:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error incrementing view",
      },
      { status: 500 }
    );
  }
}