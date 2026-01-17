import { config } from "dotenv";
import { resolve } from "path";
import type { Config } from "drizzle-kit";

// Try to load .env.local from multiple locations
const envPaths = [
  resolve(process.cwd(), ".env.local"), // apps/storefront/.env.local
  resolve(process.cwd(), "../../.env.local"), // root .env.local
];

// Load environment variables
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
  throw new Error(
    `DATABASE_URL is not set. Checked: ${envPaths.join(", ")}`
  );
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
