import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Gunakan nama tabel: job_applications
    // Hapus updated_at karena tidak ada di struktur tabel Anda
    const [result] = await db.query(
      "UPDATE job_applications SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status berhasil diperbarui",
    });
  } catch (error) {
    console.error("DETAILED_BACKEND_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
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

    // Check if application exists - UBAH KE job_applications
    const [existing] = await db.query(
      "SELECT id, cv_path, ktp_path, kartu_keluarga_path, ijazah_path, skck_path, sertifikat_paths FROM job_applications WHERE id = ?",
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

    const fs = require("fs").promises;
    const path = require("path");

    // Delete CV file if exists
    if (existing[0].cv_path) {
      const filePath = path.join(process.cwd(), "public", existing[0].cv_path);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting CV file:", err);
        // Continue even if file deletion fails
      }
    }

    // Delete KTP file if exists
    if (existing[0].ktp_path) {
      const filePath = path.join(process.cwd(), "public", existing[0].ktp_path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting KTP file:", err);
      }
    }

    // Delete Kartu Keluarga file if exists
    if (existing[0].kartu_keluarga_path) {
      const filePath = path.join(process.cwd(), "public", existing[0].kartu_keluarga_path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting Kartu Keluarga file:", err);
      }
    }

    // Delete Ijazah file if exists
    if (existing[0].ijazah_path) {
      const filePath = path.join(process.cwd(), "public", existing[0].ijazah_path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting Ijazah file:", err);
      }
    }

    // Delete SKCK file if exists
    if (existing[0].skck_path) {
      const filePath = path.join(process.cwd(), "public", existing[0].skck_path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting SKCK file:", err);
      }
    }

    // Delete Sertifikat files if exists (multiple files)
    if (existing[0].sertifikat_paths) {
      try {
        const sertifikatPaths = typeof existing[0].sertifikat_paths === 'string' 
          ? JSON.parse(existing[0].sertifikat_paths) 
          : existing[0].sertifikat_paths;
        
        for (const certPath of sertifikatPaths) {
          const filePath = path.join(process.cwd(), "public", certPath);
          try {
            await fs.unlink(filePath);
          } catch (err) {
            console.error(`Error deleting Sertifikat file ${certPath}:`, err);
          }
        }
      } catch (err) {
        console.error("Error parsing/deleting sertifikat files:", err);
      }
    }

    // Delete application from database - UBAH KE job_applications
    await db.query("DELETE FROM job_applications WHERE id = ?", [id]);

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