const mysql = require("mysql2");
require("dotenv").config();

/**
 * Database Initialization Script
 * Jalankan dengan: node scripts/initDatabase.js
 *
 * Script ini akan:
 * 1. Membuat database jika belum ada
 * 2. Membuat semua tabel yang diperlukan
 * 3. Insert data sample (optional)
 */

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
});

const dbName = process.env.DB_NAME || "souci_db";

const createDatabaseAndTables = `
-- Buat Database
CREATE DATABASE IF NOT EXISTS ${dbName};
USE ${dbName};

-- Tabel Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel News/Blog Articles
CREATE TABLE IF NOT EXISTS news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  image VARCHAR(255),
  category ENUM('achievement', 'company_news', 'tips', 'event') DEFAULT 'company_news',
  tags JSON,
  author_id INT,
  views INT DEFAULT 0,
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_category (category)
);

-- Tabel Job Postings
CREATE TABLE IF NOT EXISTS jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type ENUM('full_time', 'part_time', 'contract', 'internship') DEFAULT 'full_time',
  salary_range VARCHAR(100),
  education VARCHAR(100),
  experience VARCHAR(100),
  category VARCHAR(100),
  description TEXT NOT NULL,
  responsibilities JSON NOT NULL,
  requirements JSON NOT NULL,
  benefits JSON NOT NULL,
  status ENUM('open', 'closed') DEFAULT 'open',
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status)
);

-- Tabel Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  cv_path VARCHAR(255) NOT NULL,
  cover_letter TEXT,
  status ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted') DEFAULT 'pending',
  notes TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  INDEX idx_job_id (job_id),
  INDEX idx_status (status),
  INDEX idx_email (email)
);

-- Tabel Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email)
);

-- Tabel Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  company VARCHAR(255),
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  image VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_display_order (display_order)
);

-- Tabel Company Statistics (untuk counter di homepage)
CREATE TABLE IF NOT EXISTS statistics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order)
);

-- Tabel Settings (untuk konfigurasi website)
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

console.log("🚀 Starting database initialization...\n");

connection.connect((err) => {
  if (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }

  console.log("✅ Connected to MySQL server");

  connection.query(createDatabaseAndTables, (err, results) => {
    if (err) {
      console.error("❌ Error creating database/tables:", err.message);
      connection.end();
      process.exit(1);
    }

    console.log("✅ Database and tables created successfully");

    // Insert default admin user
    const bcrypt = require("bcryptjs");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@souciindoprima.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    const insertAdmin = `
      INSERT IGNORE INTO ${dbName}.admin_users (email, password, name, role) 
      VALUES (?, ?, 'Super Admin', 'super_admin')
    `;

    connection.query(insertAdmin, [adminEmail, hashedPassword], (err) => {
      if (err) {
        console.log("⚠️  Admin user might already exist");
      } else {
        console.log("✅ Default admin user created");
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
      }

      // Insert default statistics
      const insertStats = `
        INSERT IGNORE INTO ${dbName}.statistics (label, value, icon, display_order) VALUES
        ('Years Experience', '15+', 'calendar', 1),
        ('Happy Clients', '100+', 'users', 2),
        ('Employees', '500+', 'team', 3),
        ('Satisfaction Rate', '98%', 'star', 4)
      `;

      connection.query(insertStats, (err) => {
        if (err) {
          console.log("⚠️  Statistics might already exist");
        } else {
          console.log("✅ Default statistics inserted");
        }

        // Insert sample settings
        const insertSettings = `
          INSERT IGNORE INTO ${dbName}.settings (key_name, value, description) VALUES
          ('site_title', 'PT. Souci Indoprima', 'Website title'),
          ('site_description', 'Create Service To Build Up People', 'Website description'),
          ('contact_email', 'info@souciindoprima.com', 'Contact email'),
          ('contact_phone', '+62 21 1234567', 'Contact phone number'),
          ('contact_whatsapp', '6281234567890', 'WhatsApp number'),
          ('contact_address', 'Jakarta, Indonesia', 'Company address'),
          ('social_facebook', 'https://facebook.com/souciindoprima', 'Facebook URL'),
          ('social_instagram', 'https://instagram.com/souciindoprima', 'Instagram URL'),
          ('social_twitter', 'https://twitter.com/souciindoprima', 'Twitter URL'),
          ('social_linkedin', 'https://linkedin.com/company/souciindoprima', 'LinkedIn URL')
        `;

        connection.query(insertSettings, (err) => {
          if (err) {
            console.log("⚠️  Settings might already exist");
          } else {
            console.log("✅ Default settings inserted");
          }

          console.log("\n✨ Database initialization completed!");
          console.log("\n📝 Next steps:");
          console.log("1. Update .env file with your database credentials");
          console.log("2. Run: npm install");
          console.log("3. Run: npm run dev");
          console.log("\n🔐 Default admin credentials:");
          console.log(`   Email: ${adminEmail}`);
          console.log(`   Password: ${adminPassword}`);
          console.log(
            "   ⚠️  Please change this password after first login!\n"
          );

          connection.end();
        });
      });
    });
  });
});
