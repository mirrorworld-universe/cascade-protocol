import { date, numeric, pgTable, serial } from "drizzle-orm/pg-core";

export const sol_price = pgTable("sol_price", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  value: numeric("value").notNull(),
});
