import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import { getDatabaseCredentials } from "./credentials";

import { config } from "dotenv";

config({
  path: "../../.env",
});

const credentials = await getDatabaseCredentials();

export function createConnectionString(credentials: {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}): string {
  return `postgres://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/postgres`;
}

export const client = new Client({
  connectionString: createConnectionString(credentials),
});

await client.connect();
export const db = drizzle(client, {
  schema,
  // logger: true,
});

export function createDatabaseConnection() {}
