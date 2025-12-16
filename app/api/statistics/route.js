import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * GET /api/statistics
 * Get company statistics for homepage counter
 */
export async function GET(req) {
  try {
    const [statistics] = await db.query(
      "SELECT * FROM statistics ORDER BY display_order ASC"
    );

    return NextResponse.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching statistics",
      },
      { status: 500 }
    );
  }
}
