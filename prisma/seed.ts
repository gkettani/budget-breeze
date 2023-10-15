import { faker } from "@faker-js/faker";
import type { Prisma } from '@prisma/client';
import { db } from "../src/server/db";

function createRandomTransaction(): Prisma.TransactionCreateInput {
  return {
    description: faker.finance.transactionDescription(),
    amount: Number.parseFloat(faker.finance.amount()),
    date: faker.date.past(),
    user: {
      connect: {
        id: "clnqkt69s0000vea47zc9vsjz",
      },
    },
  };
}

const transactions: Prisma.TransactionCreateInput[] = faker.helpers.multiple(createRandomTransaction, {
  count: 25,
});

function main() {
  console.log("Seeding transactions...");
  return Promise.all(
    transactions.map(async (tsx) => {
      await db.transaction.create({
        data: tsx,
      });
    })
  );
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