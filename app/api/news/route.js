import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * GET /api/news
 * Get all published news articles
 * Query params: category, limit, offset
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = parseInt(searchParams.get("offset")) || 0;
    const includeAll = searchParams.get("includeAll") === "true"; // Parameter untuk admin

    let query = "SELECT * FROM news";
    const params = [];
    const conditions = [];

    // Jika bukan admin request, hanya tampilkan published
    if (!includeAll) {
      conditions.push('status = "published"');
    }

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC, published_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [news] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: news,
      total: news.length,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching news articles",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/news
 * Create new news article with image upload
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    let category = formData.get("category");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    const imageFile = formData.get("image");
    const author = formData.get("author");
    const status = formData.get("status") || "draft";
    const published_at = formData.get("published_at");

    // Validate category ENUM
    const validCategories = ["achievement", "company_news", "tips", "event"];
    if (category && !validCategories.includes(category)) {
      category = "company_news"; // Default to company_news if invalid
    }
    if (!category) {
      category = "company_news";
    }

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, slug, and content are required",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await db.query("SELECT id FROM news WHERE slug = ?", [
      slug,
    ]);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        { status: 400 }
      );
    }

    // Handle image upload
    let imagePath = null;
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

      imagePath = `/uploads/news/${filename}`;
    }

    // Insert news
    const [result] = await db.query(
      `INSERT INTO news (title, slug, category, excerpt, content, image, status, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        category || "company_news",
        excerpt || null,
        content,
        imagePath,
        status,
        published_at || (status === "published" ? new Date() : null),
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "News article created successfully",
        data: {
          id: result.insertId,
          title,
          slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating news article",
      },
      { status: 500 }
    );
  }
}
