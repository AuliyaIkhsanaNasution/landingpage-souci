import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * Middleware untuk verifikasi JWT token
 * @param {Function} handler - Handler function yang akan diproteksi
 * @returns {Function} Protected handler
 */
export function withAuth(handler) {
  return async (req, context) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication required",
          },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info to request
        req.user = decoded;
        return handler(req, context);
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Verify JWT token from request
 * @param {Request} req - Next.js request object
 * @returns {Object|null} Decoded token or null
 */
export function verifyToken(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
