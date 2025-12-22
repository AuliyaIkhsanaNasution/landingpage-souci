import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * Helper function to validate and save file
 */
async function saveFile(file, folder, allowedTypes, maxSize = 5 * 1024 * 1024) {
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type for ${folder}`);
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size for ${folder} must not exceed 5MB`);
  }

  // Create upload directory if not exists
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.round(Math.random() * 1e9);
  const ext = path.extname(file.name);
  const filename = `${folder}-${timestamp}-${randomString}${ext}`;

  // Save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
}

/**
 * POST /api/applications
 * Submit job application with multiple document uploads
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    // Get form fields
    const job_id = formData.get("job_id");
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const whatsapp = formData.get("whatsapp");
    const cover_letter = formData.get("cover_letter");

    // Get files
    const cvFile = formData.get("cv");
    const ktpFile = formData.get("ktp");
    const kartuKeluargaFile = formData.get("kartu_keluarga");
    const ijazahFile = formData.get("ijazah");
    const skckFile = formData.get("skck");

    // Validate required fields
    if (!job_id || !name || !email || !phone || !whatsapp || !cvFile || !ktpFile || !kartuKeluargaFile || !ijazahFile || !skckFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields including CV, KTP, Kartu Keluarga, Ijazah, and SKCK",
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

    // Define allowed types for each document
    const documentTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

    // Save CV
    const cvPath = await saveFile(cvFile, "cv", documentTypes);

    // Save KTP
    const ktpPath = await saveFile(ktpFile, "ktp", imageTypes);

    // Save Kartu Keluarga
    const kartuKeluargaPath = await saveFile(kartuKeluargaFile, "kartu_keluarga", imageTypes);

    // Save Ijazah
    const ijazahPath = await saveFile(ijazahFile, "ijazah", imageTypes);

    // Save SKCK
    const skckPath = await saveFile(skckFile, "skck", imageTypes);

    // Handle multiple sertifikat files (optional)
    let sertifikatPaths = [];
    let index = 0;
    while (formData.has(`sertifikat[${index}]`)) {
      const sertifikatFile = formData.get(`sertifikat[${index}]`);
      if (sertifikatFile && sertifikatFile.size > 0) {
        const sertifikatPath = await saveFile(sertifikatFile, "sertifikat", imageTypes);
        sertifikatPaths.push(sertifikatPath);
      }
      index++;
    }

    // Convert sertifikat paths to JSON string
    const sertifikatPathsJson = sertifikatPaths.length > 0 ? JSON.stringify(sertifikatPaths) : null;

    // Save application to database
    const [result] = await db.query(
      `INSERT INTO job_applications 
      (job_id, name, email, phone, whatsapp, cv_path, ktp_path, kartu_keluarga_path, ijazah_path, skck_path, sertifikat_paths, cover_letter) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job_id,
        name,
        email,
        phone,
        whatsapp,
        cvPath,
        ktpPath,
        kartuKeluargaPath,
        ijazahPath,
        skckPath,
        sertifikatPathsJson,
        cover_letter || null
      ]
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
        message: error.message || "Error submitting application",
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