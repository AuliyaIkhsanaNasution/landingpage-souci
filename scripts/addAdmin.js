import bcrypt from "bcryptjs";
import { db } from "../lib/database.js";

function parseArgs() {
  const args = {};
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = raw[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

async function run() {
  const args = parseArgs();
  const email = args.email || process.env.NEW_ADMIN_EMAIL;
  const password = args.password || process.env.NEW_ADMIN_PASSWORD;
  const name = args.name || process.env.NEW_ADMIN_NAME || "Administrator";
  const role = args.role || process.env.NEW_ADMIN_ROLE || "super_admin";

  if (!email || !password) {
    console.error(
      'Usage: node scripts/addAdmin.js --email user@example.com --password secret [--name "Admin Name"] [--role super_admin]'
    );
    process.exit(1);
  }

  try {
    const saltRounds = 10;
    const hashed = bcrypt.hashSync(password, saltRounds);

    const sql = `INSERT INTO admin_users (email, password, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
    const [result] = await db.query(sql, [email, hashed, name, role]);

    console.log(
      "✅ Admin user created successfully. InsertId:",
      result.insertId
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin user:", err.message || err);
    process.exit(1);
  }
}

run();
