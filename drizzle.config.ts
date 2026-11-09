import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env on its own.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env: rely on variables already in the environment (e.g. the client's server).
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
});
