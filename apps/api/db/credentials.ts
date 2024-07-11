import { config } from "dotenv";

config({
  path: "../../.env",
});

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export interface DatabaseCredentials {
  password: string;
  host: string;
  dbhost: string;
  username: string;
  port: number;
  database: string;
  birdeyeApiKey: string;
  engine?: string;
  dbInstanceIdentifier?: string;
}

export async function getDatabaseCredentials(): Promise<
  Omit<DatabaseCredentials, "dbhost">
> {
  const secretName = process.env.POSTGRES_SECRET_ARN;

  if (!secretName) {
    return {
      host: process.env.DATABASE_HOST || "",
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT)
        : 5432,
      username: process.env.DATABASE_USERNAME || "",
      password: process.env.DATABASE_PASSWORD || "",
      database: process.env.DATABASE_NAME || "",
      birdeyeApiKey: process.env.BIRDEYE_API_KEY || "",
    };
  }

  const secretsManager = new SecretsManagerClient({
    region: "us-west-2",
  });

  try {
    const response = await secretsManager.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      })
    );
    if (response.SecretString) {
      const { dbhost, ...rest } = JSON.parse(
        response.SecretString
      ) as DatabaseCredentials;

      const credentials = {
        ...rest,
        host: dbhost,
      };

      return credentials;
    } else {
      throw new Error("No secret string found");
    }
  } catch (error) {
    throw error;
  }
}

export async function createDatabaseConnectionURL() {
  if (process.env.DB_CONNECTION_URL) return process.env.DB_CONNECTION_URL;
  const credentials = await getDatabaseCredentials();
  const connectionString = `postgres://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;
  process.env.DB_CONNECTION_URL = connectionString;
  return connectionString;
}
