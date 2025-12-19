import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * GET /api/jobs/[slug]
 * Get single job posting by slug or id
 */
export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    // Check if slug is numeric (id) or string (slug)
    const isId = !isNaN(slug);
    const query = isId
      ? "SELECT * FROM jobs WHERE id = ?"
      : "SELECT * FROM jobs WHERE slug = ?";

    const [jobs] = await db.query(query, [slug]);

    if (jobs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job posting not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jobs[0],
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching job posting",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/jobs/[slug]
 * Update existing job posting (use ID as slug for update)
 */
export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    const id = slug; // For update, slug should be ID
    const body = await req.json();
    const {
      title,
      slug: newSlug,
      company,
      location,
      type,
      salary_range,
      kuota,
      education,
      experience,
      category,
      description,
      responsibilities,
      requirements,
      benefits,
      status,
      deadline,
    } = body;

    // Check if job exists
    const [existing] = await db.query(
      "SELECT id, slug FROM jobs WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found",
        },
        { status: 404 }
      );
    }

    // Check if slug is taken by another job
    if (newSlug && newSlug !== existing[0].slug) {
      const [slugCheck] = await db.query(
        "SELECT id FROM jobs WHERE slug = ? AND id != ?",
        [newSlug, id]
      );

      if (slugCheck.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already exists",
          },
          { status: 400 }
        );
      }
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

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (newSlug !== undefined) {
      updates.push("slug = ?");
      values.push(newSlug);
    }
    if (company !== undefined) {
      updates.push("company = ?");
      values.push(company);
    }
    if (location !== undefined) {
      updates.push("location = ?");
      values.push(location);
    }
    if (type !== undefined) {
      updates.push("type = ?");
      values.push(type);
    }
    if (salary_range !== undefined) {
      updates.push("salary_range = ?");
      values.push(salary_range || null);
    }
    if (kuota !== undefined) {
      updates.push("kuota = ?");
      values.push(kuota || null);
    }
    if (education !== undefined) {
      updates.push("education = ?");
      values.push(education || null);
    }
    if (experience !== undefined) {
      updates.push("experience = ?");
      values.push(experience || null);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      values.push(category || null);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (responsibilities !== undefined) {
      updates.push("responsibilities = ?");
      values.push(processArrayField(responsibilities));
    }
    if (requirements !== undefined) {
      updates.push("requirements = ?");
      values.push(processArrayField(requirements));
    }
    if (benefits !== undefined) {
      updates.push("benefits = ?");
      values.push(processArrayField(benefits));
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (deadline !== undefined) {
      updates.push("deadline = ?");
      values.push(deadline || null);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields to update",
        },
        { status: 400 }
      );
    }

    // Add updated_at
    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    // Execute update
    await db.query(
      `UPDATE jobs SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating job posting",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/jobs/[slug]
 * Delete job posting (use ID as slug for delete)
 */
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    const id = slug;

    // Check if job exists
    const [existing] = await db.query("SELECT id FROM jobs WHERE id = ?", [id]);

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found",
        },
        { status: 404 }
      );
    }

    // Delete related applications first (if table exists)
    try {
      await db.query("DELETE FROM job_applications WHERE job_id = ?", [id]);
    } catch (err) {
      // Ignore if table doesn't exist yet
      if (err.code !== "ER_NO_SUCH_TABLE") {
        throw err;
      }
    }

    // Delete job
    await db.query("DELETE FROM jobs WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting job posting",
      },
      { status: 500 }
    );
  }
}
