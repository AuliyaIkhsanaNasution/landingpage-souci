import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/database";

/**
 * POST /api/auth/register
 * Register new admin (super admin only)
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, role = "admin" } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password, and name are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existing] = await db.query(
      "SELECT id FROM admin_users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      "INSERT INTO admin_users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, role]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        data: {
          id: result.insertId,
          email,
          name,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating admin user",
      },
      { status: 500 }
    );
  }
}
