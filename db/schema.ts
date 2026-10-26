import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const staff = sqliteTable("staff", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
});
export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  staffId: text("staff_id")
    .notNull()
    .references(() => staff.id),
  expires: integer("expires").notNull(),
});
export const incidents = sqliteTable(
  "incidents",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    status: text("status").notNull(),
    assigned: text("assigned").references(() => staff.id),
    data: text("data").notNull(),
    updated: text("updated").notNull(),
  },
  (t) => [
    index("status_idx").on(t.status),
    index("assigned_idx").on(t.assigned),
  ],
);
export const limits = sqliteTable("limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
});
