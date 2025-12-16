import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { corsResponse } from "@/lib/cors";

/**
 * GET /api/health
 * Health check endpoint untuk monitoring
 */
export async function GET(req) {
  try {
    // Test database connection
    const [result] = await db.query("SELECT 1 + 1 AS result");

    const dbStatus = result[0].result === 2 ? "connected" : "error";

    return corsResponse({
      status: "ok",
      message: "PT. Souci Indoprima Backend API is running",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || "development",
      version: "2.0.0 (Next.js Integrated)",
    });
  } catch (error) {
    console.error("Health check error:", error);
    return corsResponse(
      {
        status: "error",
        message: "Backend API is running but database connection failed",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error.message,
      },
      500
    );
  }
}
