import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/database";
import { corsResponse } from "@/lib/cors";

/**
 * OPTIONS /api/auth/login
 * Handle CORS preflight requests
 */
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * POST /api/auth/login
 * Admin login
 */
export async function POST(req) {
  try {
    console.log("[LOGIN] Request received");
    const body = await req.json();
    const { email, password } = body;
    console.log("[LOGIN] Email:", email);

    // Validate input
    if (!email || !password) {
      return corsResponse(
        {
          success: false,
          message: "Email and password are required",
        },
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return corsResponse(
        {
          success: false,
          message: "Invalid email format",
        },
        400
      );
    }

    // Find user
    console.log("[LOGIN] Querying database for user:", email);
    const [users] = await db.query(
      "SELECT * FROM admin_users WHERE email = ?",
      [email]
    );
    console.log("[LOGIN] Users found:", users.length);

    if (users.length === 0) {
      console.log("[LOGIN] User not found:", email);
      return corsResponse(
        {
          success: false,
          message: "Invalid email or password",
        },
        401
      );
    }

    const user = users[0];

    // Check password
    console.log("[LOGIN] Checking password...");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("[LOGIN] Password valid:", isValidPassword);
    
    if (!isValidPassword) {
      console.log("[LOGIN] Password mismatch for:", email);
      return corsResponse(
        {
          success: false,
          message: "Invalid email or password",
        },
        401
      );
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("[LOGIN] JWT_SECRET is not set!");
      return corsResponse(
        {
          success: false,
          message: "Server configuration error",
        },
        500
      );
    }

    // Generate JWT token
    console.log("[LOGIN] Generating JWT token...");
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("[LOGIN] JWT token generated successfully");

    // Remove password from response
    delete user.password;

    console.log("[LOGIN] Login successful for:", email);
    return corsResponse({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("[LOGIN] Error during login:", error);
    console.error("[LOGIN] Error stack:", error.stack);
    return corsResponse(
      {
        success: false,
        message: process.env.NODE_ENV === "development" 
          ? `Error during login: ${error.message}` 
          : "Error during login. Please try again.",
      },
      500
    );
  }
}
