import { boolean, pgTable, uuid, varchar, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 30}).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: date('created_at').defaultNow().notNull(),
    updatedAt: date('updated_at').defaultNow().notNull(),
});

export const profilesTable = pgTable('profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique().references(() => usersTable.id),
    name: varchar('name', { length: 100 }),
    createdAt: date('created_at').defaultNow().notNull(),
    updatedAt: date('updated_at').defaultNow().notNull(),
});