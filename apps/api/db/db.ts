import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

import { config } from "dotenv";

config({
  path: "../../.env",
});

export const client = new Client({
  host: process.env.DATABASE_HOST,
  port: !!process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT)
    : 5432,
  database: process.env.DATABASE_DB,
});

await client.connect();
export const db = drizzle(client, {
  schema,
});
