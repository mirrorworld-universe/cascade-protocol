import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const test_table = pgTable("test_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});
