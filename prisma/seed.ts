import { faker } from "@faker-js/faker";
import type { Transaction, FinancialAccount, Category } from '@prisma/client';
import { db } from "../src/server/db";

const USER_ID = 'clqjkimtn0000vefwgczvtltf';

function createRandomTransaction(financialAccounts: FinancialAccount[], categories: Category[]): Omit<Transaction, 'id'> {
  return {
    description: faker.finance.transactionDescription(),
    amount: Number.parseFloat(faker.finance.amount(-1000, 1000)),
    date: faker.date.past(),
    financialAccountId: faker.helpers.arrayElement(financialAccounts).id,
    categoryId: faker.helpers.arrayElement(categories).id,
    userId: USER_ID,
  };
}

function createRandomFinancialAccount(): FinancialAccount {
  return {
    id: faker.string.uuid(),
    name: faker.finance.accountName().concat(' ', faker.string.alpha(2)),
    balance: Number.parseFloat(faker.finance.amount(500, 5000)),
    userId: USER_ID,
  };
}

function createRandomCategory(): Category {
  return {
    id: faker.string.uuid(),
    name: 'Category'.concat(' ', faker.string.alpha(5)),
    budget: Number.parseFloat(faker.finance.amount(100, 1000)),
    userId: USER_ID,
  };
}

const financialAccounts: FinancialAccount[] = faker.helpers.multiple(createRandomFinancialAccount, {
  count: 5,
});

const categories: Category[] = faker.helpers.multiple(createRandomCategory, {
  count: 5,
});

const transactions: Omit<Transaction, 'id'>[] = faker.helpers.multiple(() => createRandomTransaction(financialAccounts, categories), {
  count: 1000,
});

function main() {
  console.log("Seeding transactions...");
  return Promise.all([
    db.financialAccount.createMany({ data: financialAccounts }),
    db.category.createMany({ data: categories }),
    db.transaction.createMany({ data: transactions }),
  ]);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });