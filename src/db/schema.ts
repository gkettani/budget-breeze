import type { AdapterAccountType } from "@auth/core/adapters";
import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").unique().notNull(),
	emailVerified: integer("emailVerified", { mode: 'timestamp_ms' }),
	image: text("image"),
	lastActive: integer("last_active", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable("account", {
	userId: text("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
	type: text("type").$type<AdapterAccountType>().notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refresh_token: text("refresh_token"),
	access_token: text("access_token"),
	expires_at: integer("expires_at"),
	token_type: text("token_type"),
	scope: text("scope"),
	id_token: text("id_token"),
	session_state: text("session_state"),
}, (table) => {
	return {
		unique: unique().on(table.provider, table.providerAccountId),
	};
});

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").unique().notNull(),
	expires: integer("expires", { mode: 'timestamp_ms' }).notNull(),
}, (table) => {
	return {
		unique: unique().on(table.identifier, table.token),
	};
});

export const categories = sqliteTable("category", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
	name: text("name").notNull(),
	budget: integer("budget").default(0).notNull(),
	target: integer("target").default(0).notNull(),
});

export const financialAccounts = sqliteTable("financial_account", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
	name: text("name").notNull(),
	balance: integer("balance").notNull(),
});

export const transactions = sqliteTable("transaction", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
	description: text("description").notNull(),
	amount: integer("amount").notNull(),
	date: integer("date", { mode: 'timestamp' }).notNull(),
	categoryId: integer("category_id").references(() => categories.id, { onDelete: 'set null' }),
	financialAccountId: integer("financial_account_id").notNull().references(() => financialAccounts.id, { onDelete: 'cascade' }),
	type: text("type").default("expense").notNull(),
});
