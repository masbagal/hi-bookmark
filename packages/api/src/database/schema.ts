import {
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable(
  "users",
  {
    id: int().primaryKey().autoincrement().notNull(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  }
);

export const bookmarkTable = mysqlTable("bookmarks", {
  id: int().primaryKey().autoincrement().notNull(),
  user_id: int()
    .notNull()
    .references(() => usersTable.id),
  url: text().notNull(),
  created_at: timestamp().defaultNow(),
  title: text().notNull(),
  description: text().notNull(),
  image: text(),
});

export const sessionTable = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user_id: int().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  expires_at: timestamp().notNull(),
});
