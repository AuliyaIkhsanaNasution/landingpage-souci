import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * GET /api/testimonials
 * Get testimonials (approved for public, all for admin)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const includeAll = searchParams.get("includeAll") === "true"; // For admin

    let query = "SELECT * FROM testimonials";
    const params = [];

    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    } else if (!includeAll) {
      // For public, only show approved
      query += ' WHERE status = "approved"';
    }

    query += " ORDER BY display_order ASC, created_at DESC";

    const [testimonials] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching testimonials",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * Create new testimonial with image upload
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const position = formData.get("position");
    const company = formData.get("company");
    const content = formData.get("content");
    const rating = parseInt(formData.get("rating")) || 5;
    const status = formData.get("status") || "pending";
    const imageFile = formData.get("image");

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and content are required",
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
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

      imagePath = `/uploads/testimonials/${filename}`;
    }

    // Insert testimonial
    const [result] = await db.query(
      `INSERT INTO testimonials (name, position, company, content, rating, image, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        position || null,
        company || null,
        content,
        rating,
        imagePath,
        status,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created successfully",
        data: {
          id: result.insertId,
          name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating testimonial",
      },
      { status: 500 }
    );
  }
}
