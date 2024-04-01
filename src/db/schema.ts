import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").unique().notNull(),
	emailVerified: integer("emailVerified", { mode: 'timestamp_ms' }),
	image: text("image"),
});

export const accounts = sqliteTable("account", {
	userId: text("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
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
