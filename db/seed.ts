import "dotenv/config";
import { faker } from "@faker-js/faker";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "~/db";
import type { Transaction, FinancialAccount, Category } from '~/db';
import { env } from "~/env.mjs";
import { TRANSACTION_TYPE } from "~/utils/enums";

const USER_ID = '82dfc2ca-1092-43e0-a83b-ba12017fc144';

function createRandomTransaction(financialAccounts: FinancialAccount[], categories: Omit<Category, "target">[]): Omit<Transaction, 'id'> {
  return {
    description: faker.finance.transactionDescription(),
    amount: parseInt(faker.finance.amount(10, 10000)),
    date: faker.date.past(),
    type: faker.helpers.enumValue(TRANSACTION_TYPE),
    financialAccountId: faker.helpers.arrayElement(financialAccounts).id,
    categoryId: faker.helpers.arrayElement(categories).id,
    userId: USER_ID,
  };
}

function createRandomFinancialAccount(): FinancialAccount {
  return {
    id: parseInt(faker.string.numeric(5)),
    name: faker.finance.accountName().concat(' ', faker.string.alpha(2)),
    balance: parseInt(faker.finance.amount(5000, 50000)),
    userId: USER_ID,
  };
}

function createRandomCategory(): Category {
  return {
    id: parseInt(faker.string.numeric(5)),
    name: 'Category'.concat(' ', faker.string.alpha(5)),
    budget: parseInt(faker.finance.amount(1000, 10000)),
    target: parseInt(faker.finance.amount(1000, 10000)),
    userId: USER_ID,
  };
}

const financialAccounts = faker.helpers.multiple(createRandomFinancialAccount, {
  count: 5,
});

const categories = faker.helpers.multiple(createRandomCategory, {
  count: 5,
});

const transactions = faker.helpers.multiple(() => createRandomTransaction(financialAccounts, categories), {
  count: 1000,
});

function main() {
  const db = drizzle(
    createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN }),
  );
  console.log("Seeding transactions...");
  return Promise.all([
    db.insert(schema.financialAccounts).values(financialAccounts).execute(),
    db.insert(schema.categories).values(categories).execute(),
    db.insert(schema.transactions).values(transactions).execute(),
  ]);
}

main()
  .then(() => {
    console.log("Seeded successfully");
  })
  .catch((e) => {
    console.error("Seeding failed");
    console.error(e);
    process.exit(1);
  });