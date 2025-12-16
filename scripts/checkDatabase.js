const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * Database Content Verification Script
 * Checks if all tables have necessary data
 */

async function checkDatabaseContent() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "souci_db",
    port: process.env.DB_PORT || 3306,
  });

  console.log("🔍 Checking database content...\\n");

  try {
    // Check admin users
    const [admins] = await connection.query(
      "SELECT id, email, name, role FROM admin_users"
    );
    console.log(`✅ Admin Users: ${admins.length} found`);
    if (admins.length > 0) {
      console.log(`   Default admin: ${admins[0].email}`);
    } else {
      console.log("   ⚠️  No admin users found! Run: npm run init-db");
    }

    // Check published news
    const [news] = await connection.query(
      "SELECT COUNT(*) as count FROM news WHERE status='published'"
    );
    console.log(`\\n✅ Published News: ${news[0].count} articles`);
    if (news[0].count === 0) {
      console.log("   ⚠️  No published news! Add news via dashboard admin");
    }

    // Check open jobs
    const [jobs] = await connection.query(
      "SELECT COUNT(*) as count FROM jobs WHERE status='open'"
    );
    console.log(`\\n✅ Open Jobs: ${jobs[0].count} positions`);
    if (jobs[0].count === 0) {
      console.log("   ⚠️  No open jobs! Add jobs via dashboard admin");
      console.log("   This is why job listings page shows empty/broken");
    }

    // Check approved testimonials
    const [testimonials] = await connection.query(
      "SELECT COUNT(*) as count FROM testimonials WHERE status='approved'"
    );
    console.log(`\\n✅ Approved Testimonials: ${testimonials[0].count} reviews`);
    if (testimonials[0].count === 0) {
      console.log("   ⚠️  No approved testimonials! Using fallback data");
    }

    // Check statistics
    const [statistics] = await connection.query(
      "SELECT * FROM statistics ORDER BY display_order"
    );
    console.log(`\\n✅ Statistics: ${statistics.length} items`);
    if (statistics.length > 0) {
      statistics.forEach((stat) => {
        console.log(`   - ${stat.label}: ${stat.value}`);
      });
    } else {
      console.log("   ⚠️  No statistics found! Run: npm run init-db");
    }

    // Check settings
    const [settings] = await connection.query("SELECT COUNT(*) as count FROM settings");
    console.log(`\\n✅ Settings: ${settings[0].count} configuration items`);
    if (settings[0].count === 0) {
      console.log("   ⚠️  No settings found! Run: npm run init-db");
    }

    // Check contact messages
    const [contacts] = await connection.query(
      "SELECT COUNT(*) as count FROM contact_messages"
    );
    console.log(`\\n✅ Contact Messages: ${contacts[0].count} messages`);

    // Check job applications
    const [applications] = await connection.query(
      "SELECT COUNT(*) as count FROM job_applications"
    );
    console.log(`\\n✅ Job Applications: ${applications[0].count} applications`);

    console.log("\\n" + "=".repeat(60));
    console.log("\\n📊 Summary:");
    
    const issues = [];
    if (admins.length === 0) issues.push("No admin users");
    if (news[0].count === 0) issues.push("No published news");
    if (jobs[0].count === 0) issues.push("No open jobs");
    if (statistics.length === 0) issues.push("No statistics");
    if (settings[0].count === 0) issues.push("No settings");

    if (issues.length === 0) {
      console.log("✅ Database is properly populated!");
    } else {
      console.log("⚠️  Issues found:");
      issues.forEach((issue) => console.log(`   - ${issue}`));
      console.log("\\n💡 Recommendation: Run 'npm run init-db' to populate database");
    }

  } catch (error) {
    console.error("❌ Error checking database:", error.message);
  } finally {
    await connection.end();
  }
}

checkDatabaseContent();
