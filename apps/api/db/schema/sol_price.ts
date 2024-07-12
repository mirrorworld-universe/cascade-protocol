import { date, numeric, pgTable, uuid } from "drizzle-orm/pg-core";

export const sol_price = pgTable("sol_price", {
  id: uuid("id").defaultRandom(),
  date: date("date").notNull(),
  value: numeric("value").notNull(),
});
