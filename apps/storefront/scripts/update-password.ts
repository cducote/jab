import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Get current directory for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from multiple locations
const envPaths = [
  resolve(__dirname, "../.env.local"),
  resolve(__dirname, "../../../.env.local"),
];

for (const envPath of envPaths) {
  try {
    const result = config({ path: envPath });
    if (!result.error && process.env.DATABASE_URL) {
      break;
    }
  } catch {
    // Continue to next path
  }
}

if (!process.env.DATABASE_URL) {
  config(); // Try default locations
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "adminjack";
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || "Liam1111";

async function updatePassword() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set in environment variables");
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_USERNAME))
      .limit(1);

    if (user.length === 0) {
      throw new Error(`User with email "${ADMIN_USERNAME}" not found in database`);
    }

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.email, ADMIN_USERNAME));

    console.log("✅ Password updated successfully");
    console.log(`   Username: ${ADMIN_USERNAME}`);
  } catch (error) {
    console.error("Error updating password:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

updatePassword();
