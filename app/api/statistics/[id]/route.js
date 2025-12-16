import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * PUT /api/statistics/[id]
 * Update statistic value
 */
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, value, icon, display_order } = body;

    // Check if statistic exists
    const [existing] = await db.query(
      "SELECT id FROM statistics WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Statistic not found",
        },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (value !== undefined) {
      updates.push("value = ?");
      values.push(value);
    }
    if (icon !== undefined) {
      updates.push("icon = ?");
      values.push(icon);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      values.push(display_order);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields to update",
        },
        { status: 400 }
      );
    }

    // Add updated_at
    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    // Execute update
    await db.query(
      `UPDATE statistics SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Statistic updated successfully",
    });
  } catch (error) {
    console.error("Error updating statistic:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating statistic",
      },
      { status: 500 }
    );
  }
}
