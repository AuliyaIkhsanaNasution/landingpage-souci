import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/database";

/**
 * Helper function to validate and save file
 */
async function saveFile(file, folder, allowedTypes, maxSize = 5 * 1024 * 1024) {
  // Validate file exists
  if (!file || file.size === 0) {
    throw new Error(`No file provided for ${folder}`);
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Salah Tipe File ${folder}. Hanya Bisa Upload ${allowedTypes.join(", ")}`);
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size for ${folder} exceeds 5MB limit`);
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
    const suratLamaranFile = formData.get("surat_lamaran");
    const pasFotoFile = formData.get("pas_foto");
    const ktpFile = formData.get("ktp");
    const kartuKeluargaFile = formData.get("kartu_keluarga");
    const ijazahFile = formData.get("ijazah");
    const skckFile = formData.get("skck");

    // Validate required fields
    if (!job_id || !name || !email || !phone || !whatsapp) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    // Validate required files
    if (!cvFile || !suratLamaranFile || !pasFotoFile || !ktpFile || !kartuKeluargaFile || !ijazahFile || !skckFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload all required documents: CV, Surat Lamaran, Pas Foto, KTP, Kartu Keluarga, Ijazah, and SKCK",
        },
        { status: 400 }
      );
    }

    // Check if job exists and is open
    const [job] = await db.query(
      'SELECT id FROM jobs WHERE id = ? AND status = "open"',
      [job_id]
    );

    if (job.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job posting not found or already closed",
        },
        { status: 404 }
      );
    }

    // Define allowed file types
    const documentTypes = [
      "application/pdf",
    ];
    
    const imageAndPdfTypes = [
      "image/png", 
      "image/jpeg", 
      "image/jpg", 
      "application/pdf"
    ];

    const pdfOnly = ["application/pdf"];

    // Save all required documents
    let cvPath, suratLamaranPath, pasFotoPath, ktpPath, kartuKeluargaPath, ijazahPath, skckPath;

    try {
      // Save CV (PDF or DOC)
      cvPath = await saveFile(cvFile, "cv", documentTypes);

      // Save Surat Lamaran (PDF or DOC only)
      suratLamaranPath = await saveFile(suratLamaranFile, "surat_lamaran", documentTypes);

      // Save Pas Foto (JPG/PNG only)
      pasFotoPath = await saveFile(pasFotoFile, "pas_foto", imageAndPdfTypes);

      // Save KTP (PNG, JPG, PDF)
      ktpPath = await saveFile(ktpFile, "ktp", imageAndPdfTypes);

      // Save Kartu Keluarga (PNG, JPG, PDF)
      kartuKeluargaPath = await saveFile(kartuKeluargaFile, "kartu_keluarga", imageAndPdfTypes);

      // Save Ijazah (PNG, JPG, PDF)
      ijazahPath = await saveFile(ijazahFile, "ijazah", imageAndPdfTypes);

      // Save SKCK (PNG, JPG, PDF)
      skckPath = await saveFile(skckFile, "skck", imageAndPdfTypes);

    } catch (fileError) {
      return NextResponse.json(
        {
          success: false,
          message: fileError.message || "Error uploading files",
        },
        { status: 400 }
      );
    }

    // Handle multiple sertifikat files (optional, PDF only)
    let sertifikatPaths = [];
    
    // Get all files with key "sertifikat"
    const sertifikatFiles = formData.getAll("sertifikat");
    
    if (sertifikatFiles && sertifikatFiles.length > 0) {
      for (const sertifikatFile of sertifikatFiles) {
        // Check if it's a valid file (not empty)
        if (sertifikatFile && sertifikatFile.size > 0) {
          try {
            const sertifikatPath = await saveFile(
              sertifikatFile, 
              "sertifikat", 
              pdfOnly // Only PDF allowed for certificates
            );
            sertifikatPaths.push(sertifikatPath);
          } catch (certError) {
            // If one certificate fails, continue with others
            console.error("Error uploading certificate:", certError);
          }
        }
      }
    }

    // Convert sertifikat paths to JSON string
    const sertifikatPathsJson = sertifikatPaths.length > 0 ? JSON.stringify(sertifikatPaths) : null;

    // Save application to database
    const [result] = await db.query(
      `INSERT INTO job_applications 
      (job_id, name, email, phone, whatsapp, cv_path, surat_lamaran_path, pas_foto_path, ktp_path, kartu_keluarga_path, ijazah_path, skck_path, sertifikat_paths, cover_letter) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job_id,
        name,
        email,
        phone,
        whatsapp,
        cvPath,
        suratLamaranPath,
        pasFotoPath,
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
          certificates_uploaded: sertifikatPaths.length
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error submitting application. Please try again.",
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