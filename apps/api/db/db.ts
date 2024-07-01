import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import { createDatabaseConnectionURL } from "./credentials";

import { config } from "dotenv";

config({
  path: "../../.env",
});

export async function createDatabaseConnection() {
  const client = new Client({
    connectionString: await createDatabaseConnectionURL(),
  });
  await client.connect();
  const db = drizzle(client, {
    schema,
  });

  return {
    client,
    db,
  };
}
