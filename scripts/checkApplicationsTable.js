const mysql = require("mysql2/promise");

async function checkTable() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "souci_db",
  });

  try {
    console.log("Checking job_applications table...\n");

    const [tables] = await conn.query("SHOW TABLES LIKE 'job_applications'");

    if (tables.length > 0) {
      console.log("✅ Table job_applications EXISTS\n");

      const [cols] = await conn.query("DESCRIBE job_applications");
      console.log("Table structure:");
      cols.forEach((col) => {
        console.log(
          `  - ${col.Field.padEnd(20)} ${col.Type.padEnd(25)} ${
            col.Null === "YES" ? "NULL" : "NOT NULL"
          }${col.Key ? " " + col.Key : ""}`
        );
      });

      console.log("\n");
      const [count] = await conn.query(
        "SELECT COUNT(*) as total FROM job_applications"
      );
      console.log(`Total applications: ${count[0].total}`);
    } else {
      console.log("❌ Table job_applications DOES NOT EXIST");
      console.log("\nTo create the table, run:");
      console.log(`
CREATE TABLE job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cv_path VARCHAR(255) NOT NULL,
  cover_letter TEXT,
  status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
      `);
    }
  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    await conn.end();
  }
}

checkTable();
