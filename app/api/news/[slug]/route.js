import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * GET /api/news/[slug]
 * Get single news article by slug (can be slug or id)
 */
export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    // Check if slug is numeric (id) or string (slug)
    const isId = !isNaN(slug);
    const query = isId
      ? 'SELECT * FROM news WHERE id = ? AND status = "published"'
      : 'SELECT * FROM news WHERE slug = ? AND status = "published"';

    const [news] = await db.query(query, [slug]);

    if (news.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "News article not found",
        },
        { status: 404 }
      );
    }

    // // Increment view count
    // if (isId) {
    //   await db.query("UPDATE news SET views = views + 1 WHERE id = ?", [slug]);
    // } else {
    //   await db.query("UPDATE news SET views = views + 1 WHERE slug = ?", [
    //     slug,
    //   ]);
    // }

    return NextResponse.json({
      success: true,
      data: news[0],
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching news article",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/news/[slug]
 * Update existing news article with optional image upload (use ID as slug for update)
 */
export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    const formData = await req.formData();

    const title = formData.get("title");
    const newSlug = formData.get("slug");
    let category = formData.get("category");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    const imageFile = formData.get("image");
    const author = formData.get("author");
    const status = formData.get("status");
    const published_at = formData.get("published_at");

    // Validate category ENUM if provided
    if (category !== undefined && category !== null) {
      const validCategories = ["achievement", "company_news", "tips", "event"];
      if (!validCategories.includes(category)) {
        category = "company_news"; // Default to company_news if invalid
      }
    }

    // For update, slug should be ID
    const id = slug;

    // Check if news exists
    const [existing] = await db.query(
      "SELECT id, slug FROM news WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "News article not found",
        },
        { status: 404 }
      );
    }

    // Check if new slug is taken by another article
    if (newSlug && newSlug !== existing[0].slug) {
      const [slugCheck] = await db.query(
        "SELECT id FROM news WHERE slug = ? AND id != ?",
        [newSlug, id]
      );

      if (slugCheck.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already exists",
          },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (newSlug !== undefined) {
      updates.push("slug = ?");
      values.push(newSlug);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      values.push(category);
    }
    if (excerpt !== undefined) {
      updates.push("excerpt = ?");
      values.push(excerpt || null);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      values.push(content);
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
      const [oldData] = await db.query("SELECT image FROM news WHERE id = ?", [
        id,
      ]);
      const oldImagePath = oldData[0]?.image;

      // Create upload directory if not exists
      const uploadDir = path.join(process.cwd(), "public", "uploads", "news");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.round(Math.random() * 1e9);
      const ext = path.extname(imageFile.name);
      const filename = `news-${timestamp}-${randomString}${ext}`;

      // Save file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const imagePath = `/uploads/news/${filename}`;
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
    if (published_at !== undefined) {
      updates.push("published_at = ?");
      values.push(published_at || null);
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
      `UPDATE news SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "News article updated successfully",
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating news article",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/news/[slug]
 * Delete news article (use ID as slug for delete)
 */
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    const id = slug;

    // Check if news exists
    const [existing] = await db.query("SELECT id FROM news WHERE id = ?", [id]);

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "News article not found",
        },
        { status: 404 }
      );
    }

    // Delete news
    await db.query("DELETE FROM news WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "News article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting news article",
      },
      { status: 500 }
    );
  }
}
