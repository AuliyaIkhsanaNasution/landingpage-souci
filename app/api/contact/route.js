import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/database";

// Configure email transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * POST /api/contact
 * Submit contact form message
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and message are required",
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

    // Get client IP and user agent
    const ip_address =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";

    // Save to database
    const [result] = await db.query(
      "INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        phone || null,
        subject || null,
        message,
        ip_address,
        user_agent,
      ]
    );

    // Send email notification to admin
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully. We will contact you soon!",
        data: {
          message_id: result.insertId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error submitting message. Please try again later.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Get all contact messages (admin only)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = "SELECT * FROM contact_messages";
    const params = [];

    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [messages] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: messages,
      total: messages.length,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 }
    );
  }
}
