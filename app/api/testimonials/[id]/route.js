import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * PUT /api/testimonials/[id]
 * Update existing testimonial with optional image upload
 */
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get("name");
    const position = formData.get("position");
    const company = formData.get("company");
    const content = formData.get("content");
    const rating = formData.get("rating")
      ? parseInt(formData.get("rating"))
      : undefined;
    const status = formData.get("status");
    const imageFile = formData.get("image");

    // Check if testimonial exists
    const [existing] = await db.query(
      "SELECT id FROM testimonials WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (position !== undefined) {
      updates.push("position = ?");
      values.push(position || null);
    }
    if (company !== undefined) {
      updates.push("company = ?");
      values.push(company || null);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      values.push(content);
    }
    if (rating !== undefined) {
      updates.push("rating = ?");
      values.push(rating);
    }

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Only JPG, PNG, and WebP images are allowed",
          },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: "Image size must not exceed 5MB",
          },
          { status: 400 }
        );
      }

      // Get old image path to delete it
      const [oldData] = await db.query(
        "SELECT image FROM testimonials WHERE id = ?",
        [id]
      );
      const oldImagePath = oldData[0]?.image;

      // Create upload directory if not exists
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "testimonials"
      );
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.round(Math.random() * 1e9);
      const ext = path.extname(imageFile.name);
      const filename = `testimonial-${timestamp}-${randomString}${ext}`;

      // Save file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const imagePath = `/uploads/testimonials/${filename}`;
      updates.push("image = ?");
      values.push(imagePath);

      // Delete old image if exists
      if (oldImagePath && oldImagePath.startsWith("/uploads/")) {
        try {
          const oldFilePath = path.join(process.cwd(), "public", oldImagePath);
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath);
          }
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
    }

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
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
      `UPDATE testimonials SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating testimonial",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/testimonials/[id]
 * Update testimonial status (approve/reject)
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be: pending, approved, or rejected",
        },
        { status: 400 }
      );
    }

    // Check if testimonial exists
    const [existing] = await db.query(
      "SELECT id FROM testimonials WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    // Update status
    await db.query(
      "UPDATE testimonials SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: `Testimonial ${status} successfully`,
    });
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating testimonial status",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials/[id]
 * Delete testimonial
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Check if testimonial exists
    const [existing] = await db.query(
      "SELECT id FROM testimonials WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }

    // Delete testimonial
    await db.query("DELETE FROM testimonials WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting testimonial",
      },
      { status: 500 }
    );
  }
}
