import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * GET /api/statistics/dashboard
 * Get dashboard overview statistics (counts of various entities)
 */
export async function GET(req) {
  try {
    // Get counts for dashboard
    const [jobsCount] = await db.query(
      'SELECT COUNT(*) as count FROM jobs WHERE status = "open"'
    );
    const [applicationsCount] = await db.query(
      "SELECT COUNT(*) as count FROM job_applications"
    );
    const [pendingApplications] = await db.query(
      'SELECT COUNT(*) as count FROM job_applications WHERE status = "pending"'
    );
    const [newsCount] = await db.query(
      'SELECT COUNT(*) as count FROM news WHERE status = "published"'
    );
    const [contactCount] = await db.query(
      "SELECT COUNT(*) as count FROM contact_messages"
    );
    const [unreadContact] = await db.query(
      'SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"'
    );
    const [testimonialsCount] = await db.query(
      'SELECT COUNT(*) as count FROM testimonials WHERE status = "approved"'
    );
    const [pendingTestimonials] = await db.query(
      'SELECT COUNT(*) as count FROM testimonials WHERE status = "pending"'
    );

    // Get recent activities
    const [recentApplications] = await db.query(
      `SELECT a.*, j.title as job_title 
       FROM job_applications a 
       LEFT JOIN jobs j ON a.job_id = j.id 
       ORDER BY a.applied_at DESC 
       LIMIT 5`
    );

    const [jobsWithApplicants] = await db.query(
      `SELECT 
        j.id,
        j.title,
        j.location,
        j.status,
        COUNT(ja.id) as applicants_count
       FROM jobs j
       LEFT JOIN job_applications ja ON j.id = ja.job_id
       WHERE j.status = "open"
       GROUP BY j.id, j.title, j.location, j.status
       ORDER BY j.created_at DESC
       LIMIT 5`
    );

    const [recentContacts] = await db.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5"
    );

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          openJobs: jobsCount[0].count,
          totalApplications: applicationsCount[0].count,
          pendingApplications: pendingApplications[0].count,
          publishedNews: newsCount[0].count,
          totalContacts: contactCount[0].count,
          unreadContacts: unreadContact[0].count,
          approvedTestimonials: testimonialsCount[0].count,
          pendingTestimonials: pendingTestimonials[0].count,
        },
        recent: {
          applications: recentApplications,
          contacts: recentContacts,
        },
         activeJobs: jobsWithApplicants,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching dashboard statistics",
      },
      { status: 500 }
    );
  }
}
