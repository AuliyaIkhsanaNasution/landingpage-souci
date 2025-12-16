import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * GET /api/settings
 * Get all website settings or specific setting by key
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      // Get specific setting
      const [settings] = await db.query(
        "SELECT * FROM settings WHERE key_name = ?",
        [key]
      );

      if (settings.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Setting not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: settings[0],
      });
    }

    // Get all settings
    const [settings] = await db.query(
      "SELECT * FROM settings ORDER BY key_name"
    );

    return NextResponse.json({
      success: true,
      data: settings, // Return array for dashboard
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching settings",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Update settings - accepts direct object or { settings: {...} }
 */
export async function PUT(req) {
  try {
    const body = await req.json();

    // Accept both formats: direct object or { settings: {...} }
    const settingsData = body.settings || body;

    if (!settingsData || typeof settingsData !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Settings data is required",
        },
        { status: 400 }
      );
    }

    // Update each setting
    const updates = Object.entries(settingsData).map(([key, value]) => {
      return db.query(
        "UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key_name = ?",
        [value || "", key]
      );
    });

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating settings",
      },
      { status: 500 }
    );
  }
}
