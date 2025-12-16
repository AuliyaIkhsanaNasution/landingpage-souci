/**
 * Migration Script: Add education, experience, category fields to jobs table
 * Run this once to update the database schema
 */

const mysql = require("mysql2/promise");

async function migrateDatabase() {
  let connection;

  try {
    // Create connection (update these values as needed)
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "souci_db",
    });

    console.log("✅ Connected to database");

    // Check if columns already exist
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'souci_db' AND TABLE_NAME = 'jobs' 
      AND COLUMN_NAME IN ('education', 'experience', 'category')
    `);

    const existingColumns = columns.map((col) => col.COLUMN_NAME);

    // Add education column if not exists
    if (!existingColumns.includes("education")) {
      await connection.query(`
        ALTER TABLE jobs 
        ADD COLUMN education VARCHAR(100) AFTER salary_range
      `);
      console.log("✅ Added 'education' column");
    } else {
      console.log("ℹ️  'education' column already exists");
    }

    // Add experience column if not exists
    if (!existingColumns.includes("experience")) {
      await connection.query(`
        ALTER TABLE jobs 
        ADD COLUMN experience VARCHAR(100) AFTER education
      `);
      console.log("✅ Added 'experience' column");
    } else {
      console.log("ℹ️  'experience' column already exists");
    }

    // Add category column if not exists
    if (!existingColumns.includes("category")) {
      await connection.query(`
        ALTER TABLE jobs 
        ADD COLUMN category VARCHAR(100) AFTER experience
      `);
      console.log("✅ Added 'category' column");
    } else {
      console.log("ℹ️  'category' column already exists");
    }

    console.log("\n🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("✅ Database connection closed");
    }
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log("\n✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
