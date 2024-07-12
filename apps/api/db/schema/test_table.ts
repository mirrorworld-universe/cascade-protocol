import { date, text, pgTable, serial } from "drizzle-orm/pg-core";

export const test_table = pgTable("test_table", {
  id: serial("id").primaryKey(),
  entry: text("entry").notNull(),
});
