import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/*",
  out: "./db/drizzle",
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
});
