import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { resolve } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabaseConnection } from "../db/db";

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono!"));

app.get("/hello/:name", (c) => {
  const { name } = c.req.param();
  return c.json({ message: `Hello, ${name}!` });
});

app.get("/migrate", async () => {
  const { db } = await createDatabaseConnection();
  const migrationsDirectory = resolve(__dirname, "../db/drizzle");
  console.log("debug: running migrations from: ", migrationsDirectory);
  await migrate(db, { migrationsFolder: migrationsDirectory });
});

export const handler = handle(app);
