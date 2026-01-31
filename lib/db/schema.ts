import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  date,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const bills = pgTable(
  "bills",
  {
    id: serial("id").primaryKey(),
    congressNumber: integer("congress_number").notNull(),
    billType: varchar("bill_type", { length: 10 }).notNull(),
    billNumber: integer("bill_number").notNull(),
    title: text("title").notNull(),
    shortTitle: text("short_title"),
    introducedDate: date("introduced_date"),
    latestActionDate: date("latest_action_date"),
    latestActionText: text("latest_action_text"),
    sponsorName: varchar("sponsor_name", { length: 255 }),
    sponsorParty: varchar("sponsor_party", { length: 50 }),
    sponsorState: varchar("sponsor_state", { length: 50 }),
    status: varchar("status", { length: 100 }),
    subjects: text("subjects").array(),
    congressUrl: text("congress_url"),
    fullTextUrl: text("full_text_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("unique_bill").on(
      table.congressNumber,
      table.billType,
      table.billNumber
    ),
    index("idx_bills_introduced").on(table.introducedDate),
    index("idx_bills_status").on(table.status),
    index("idx_bills_congress").on(table.congressNumber),
  ]
);

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  bioguideId: varchar("bioguide_id", { length: 50 }).unique(),
  name: varchar("name", { length: 255 }),
  party: varchar("party", { length: 50 }),
  state: varchar("state", { length: 50 }),
  chamber: varchar("chamber", { length: 20 }),
});

export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;
