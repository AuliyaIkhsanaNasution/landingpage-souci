import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * POST /api/applications
 * Submit job application with CV upload
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const job_id = formData.get("job_id");
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const cover_letter = formData.get("cover_letter");
    const cvFile = formData.get("cv");

    // Validate required fields
    if (!job_id || !name || !email || !phone || !cvFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields including CV file",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(cvFile.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF, DOC, and DOCX files are allowed",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (cvFile.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File size must not exceed 5MB",
        },
        { status: 400 }
      );
    }

    // Check if job exists
    const [job] = await db.query(
      'SELECT id FROM jobs WHERE id = ? AND status = "open"',
      [job_id]
    );

    if (job.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job posting not found or closed",
        },
        { status: 404 }
      );
    }

    // Create upload directory if not exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.round(Math.random() * 1e9);
    const ext = path.extname(cvFile.name);
    const filename = `cv-${timestamp}-${randomString}${ext}`;

    // Save file
    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Save application to database
    const cvPath = `/uploads/cv/${filename}`;
    const [result] = await db.query(
      "INSERT INTO job_applications (job_id, name, email, phone, cv_path, cover_letter) VALUES (?, ?, ?, ?, ?, ?)",
      [job_id, name, email, phone, cvPath, cover_letter || null]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          application_id: result.insertId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error submitting application",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/applications
 * Get all applications (admin only)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const job_id = searchParams.get("job_id");

    let query = `
      SELECT 
        ja.*,
        j.title as job_title,
        j.company as job_company
      FROM job_applications ja
      LEFT JOIN jobs j ON ja.job_id = j.id
    `;
    const params = [];

    if (job_id) {
      query += " WHERE ja.job_id = ?";
      params.push(job_id);
    }

    query += " ORDER BY ja.applied_at DESC";

    const [applications] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: applications,
      total: applications.length,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching applications",
      },
      { status: 500 }
    );
  }
}
