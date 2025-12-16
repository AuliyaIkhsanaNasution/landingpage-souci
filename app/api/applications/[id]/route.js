import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * PATCH /api/applications/[id]
 * Update application status
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!["pending", "reviewing", "accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Must be: pending, reviewing, accepted, or rejected",
        },
        { status: 400 }
      );
    }

    // Check if application exists
    const [existing] = await db.query(
      "SELECT id FROM applications WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    // Update status
    await db.query(
      "UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating application status",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/applications/[id]
 * Delete application
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Check if application exists
    const [existing] = await db.query(
      "SELECT id, cv_path FROM applications WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    // Delete CV file if exists
    if (existing[0].cv_path) {
      const fs = require("fs").promises;
      const path = require("path");
      const filePath = path.join(process.cwd(), "public", existing[0].cv_path);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting CV file:", err);
        // Continue even if file deletion fails
      }
    }

    // Delete application from database
    await db.query("DELETE FROM applications WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting application",
      },
      { status: 500 }
    );
  }
}
