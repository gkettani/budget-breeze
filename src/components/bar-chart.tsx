import { BarChart, Card } from '@tremor/react';
import type { Transaction } from '~/db';
import { formatCurrency } from '~/utils/helpers';

type BarChartContainerProps = {
  data: Transaction[];
};

export default function BarChartContainer({ data }: BarChartContainerProps) {

  const expensesByMonth: Record<string, number> = {};
  const incomesByMonth: Record<string, number> = {};

  data?.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString("default", { month: "short", year: "2-digit" });
    const amount = Number(transaction.amount);
    if (transaction.type === "expense") {
      expensesByMonth[month] = (expensesByMonth[month] ?? 0) + amount;
    } else {
      incomesByMonth[month] = (incomesByMonth[month] ?? 0) + amount;
    }
  });

  const barChartData = Object.keys(expensesByMonth).reverse().map((month) => ({
    date: month,
    Incomes: incomesByMonth[month] ?? 0,
    Expenses: expensesByMonth[month] ?? 0,
  }));

  return (
    <>
      <Card className="sm:mx-auto sm:max-w-xl mt-10">
        <h3 className="ml-1 mr-1 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Incomes and Expenses overview
        </h3>
        <BarChart
          data={barChartData ?? []}
          index="date"
          categories={['Expenses', 'Incomes']}
          colors={['cyan', 'blue']}
          valueFormatter={formatCurrency}
          yAxisWidth={60}
          className="mt-6 hidden h-80 sm:block"
        />
      </Card>
    </>
  );
}
