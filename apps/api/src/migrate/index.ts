import { resolve } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabaseConnection } from "../../db/db";
import {
  CdkCustomResourceEvent,
  CdkCustomResourceResponse,
  Context,
} from "aws-lambda";

export const handler = async (
  event: CdkCustomResourceEvent,
  context: Context
) => {
  const response: CdkCustomResourceResponse = {
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    PhysicalResourceId: context.logGroupName,
  };

  if (event.RequestType == "Delete") {
    return {
      ...response,
      Status: "SUCCESS",
      Data: { Result: "None" },
    };
  }

  try {
    const { db } = await createDatabaseConnection();
    const migrationsDirectory = resolve(__dirname, "./drizzle");
    console.log("debug: running migrations from: ", migrationsDirectory);
    await migrate(db, {
      migrationsFolder: migrationsDirectory,
      migrationsTable: "",
    });

    return {
      ...response,
      Status: "SUCCESS",
      Data: { Result: JSON.parse(JSON.stringify(db._.tableNamesMap, null, 2)) },
    };
  } catch (error) {
    if (error instanceof Error) {
      response.Reason = error.message;
    }
    return {
      ...response,
      Status: "FAILED",
      Data: { Result: error },
    };
  }
};
