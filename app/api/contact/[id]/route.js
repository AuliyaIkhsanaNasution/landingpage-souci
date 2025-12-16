import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * PATCH /api/contact/[id]
 * Update contact message status
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    const validStatuses = ["new", "read", "replied", "archived"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Check if contact message exists
    const [existing] = await db.query(
      "SELECT id FROM contact_messages WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact message not found",
        },
        { status: 404 }
      );
    }

    // Update status
    const newStatus = status || "read";
    await db.query("UPDATE contact_messages SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: `Contact message status updated to ${newStatus}`,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating contact status",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact/[id]
 * Delete contact message
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Check if contact message exists
    const [existing] = await db.query(
      "SELECT id FROM contact_messages WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact message not found",
        },
        { status: 404 }
      );
    }

    // Delete contact message
    await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting contact message",
      },
      { status: 500 }
    );
  }
}
