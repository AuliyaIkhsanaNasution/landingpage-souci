/**
 * Check and display current settings in database
 * Run: node scripts/checkSettings.js
 */

const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "souci_db",
};

async function checkSettings() {
  let connection;

  try {
    console.log("🔍 Checking settings in database...\n");

    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to database\n");

    // Get all settings
    const [settings] = await connection.query(
      "SELECT * FROM settings ORDER BY key_name"
    );

    if (settings.length === 0) {
      console.log("⚠️  No settings found in database");
      console.log("\n💡 Run: npm run init-db to create default settings");
      return;
    }

    console.log("📋 Current Settings:");
    console.log("=".repeat(80));

    settings.forEach((setting) => {
      console.log(`\n🔑 ${setting.key_name}`);
      console.log(`   Value: ${setting.value || "(empty)"}`);
      console.log(`   Description: ${setting.description || "-"}`);
      console.log(
        `   Updated: ${new Date(setting.updated_at).toLocaleString("id-ID")}`
      );
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\n✅ Total settings: ${settings.length}`);

    // Check for expected settings
    const expectedKeys = [
      "site_title",
      "site_description",
      "contact_email",
      "contact_phone",
      "contact_whatsapp",
      "contact_address",
      "social_facebook",
      "social_instagram",
      "social_linkedin",
      "social_twitter",
    ];

    const existingKeys = settings.map((s) => s.key_name);
    const missingKeys = expectedKeys.filter((k) => !existingKeys.includes(k));

    if (missingKeys.length > 0) {
      console.log("\n⚠️  Missing settings:");
      missingKeys.forEach((key) => console.log(`   - ${key}`));
      console.log("\n💡 You may want to add these manually or re-run init-db");
    } else {
      console.log("\n✅ All expected settings are present!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n👋 Database connection closed");
    }
  }
}

checkSettings();
