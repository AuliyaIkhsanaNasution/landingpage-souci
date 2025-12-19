import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * GET /api/jobs
 * Get all open job postings
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "open";
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = "SELECT * FROM jobs";
    const queryParams = [];

    if (status !== "all") {
      query += " WHERE status = ?";
      queryParams.push(status);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [jobs] = await db.query(query, queryParams);

    return NextResponse.json({
      success: true,
      data: jobs,
      total: jobs.length,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching job postings",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs
 * Create new job posting
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      company,
      location,
      type = "full_time",
      salary_range,
      kuota,
      education,
      experience,
      category,
      description,
      responsibilities,
      requirements,
      benefits,
      status = "open",
      deadline,
    } = body;

    // Validate required fields
    if (!title || !slug || !company || !location || !description) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title, slug, company, location, and description are required",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await db.query(
      "SELECT id, title FROM jobs WHERE slug = ?",
      [slug]
    );

    if (existing.length > 0) {
      const suggestedSlug = slug + "-" + Date.now().toString().slice(-6);
      return NextResponse.json(
        {
          success: false,
          message: `Slug "${slug}" sudah digunakan untuk lowongan "${existing[0].title}". Gunakan slug lain atau tambahkan suffix unik.`,
          suggestedSlug: suggestedSlug,
        },
        { status: 400 }
      );
    }

    // Process array fields (can be string or array)
    const processArrayField = (field) => {
      if (!field) return JSON.stringify([]);
      if (Array.isArray(field)) return JSON.stringify(field);
      // If it's a string, split by newline and filter empty lines
      return JSON.stringify(
        field
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      );
    };

    // Insert job
    const [result] = await db.query(
      `INSERT INTO jobs (title, slug, company, location, type, salary_range, kuota, education, experience, category, description, 
       responsibilities, requirements, benefits, status, deadline) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        company,
        location,
        type,
        salary_range || null,
        kuota || null,
        education || null,
        experience || null,
        category || null,
        description,
        processArrayField(responsibilities),
        processArrayField(requirements),
        processArrayField(benefits),
        status,
        deadline || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Job created successfully",
        data: {
          id: result.insertId,
          title,
          slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating job posting: " + error.message,
      },
      { status: 500 }
    );
  }
}
