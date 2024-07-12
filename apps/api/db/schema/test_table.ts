import { pgTable, serial, varchar, uuid } from "drizzle-orm/pg-core";

export const test_table = pgTable("test_table", {
  id: uuid("id").defaultRandom(),
  name: varchar("name", { length: 256 }),
});
