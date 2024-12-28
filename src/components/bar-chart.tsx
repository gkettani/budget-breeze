import { BarChart, Card } from "@tremor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Transaction } from "~/db";
import { cn } from "~/lib/utils";
import { TRANSACTION_TYPE } from "~/utils/enums";
import { formatCurrency, formatPercent } from "~/utils/helpers";

type BarChartContainerProps = {
  data: Omit<Transaction, "userId">[];
};

export default function BarChartContainer({ data }: BarChartContainerProps) {
  const expensesByMonth: Record<string, number> = {};
  const incomesByMonth: Record<string, number> = {};

  data?.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    const amount = Number(transaction.amount);
    if (transaction.type === TRANSACTION_TYPE.EXPENSE) {
      expensesByMonth[month] = (expensesByMonth[month] ?? 0) + amount;
    } else {
      incomesByMonth[month] = (incomesByMonth[month] ?? 0) + amount;
    }
  });

  const barChartData = Object.keys(expensesByMonth)
    .reverse()
    .map((month) => {
      const incomes = incomesByMonth[month] ?? 0;
      const expenses = expensesByMonth[month] ?? 0;
      const savings = incomes - expenses;
      const savingsRate = incomes > 0 ? savings / incomes : 0;
      return {
        date: month,
        Incomes: incomes,
        Expenses: expenses,
        Savings: savings,
        "Savings rate": savingsRate,
      };
    });

  const tabs = [
    {
      name: "Incomes vs Expenses",
      data: barChartData ?? [],
      categories: ["Expenses", "Incomes"],
      colors: ["cyan", "blue"],
      valueFormatter: formatCurrency,
      summary: [
        {
          name: "Incomes",
          total: barChartData
            .map((item) => item.Incomes)
            .reduce((acc, value) => acc + value, 0),
          color: "bg-blue-500",
        },
        {
          name: "Expenses",
          total: barChartData
            .map((item) => item.Expenses)
            .reduce((acc, value) => acc + value, 0),
          color: "bg-cyan-500",
        },
      ],
    },
    {
      name: "Savings",
      data: barChartData ?? [],
      categories: ["Savings"],
      colors: ["emerald"],
      valueFormatter: formatCurrency,
      summary: [
        {
          name: "Total savings",
          total: barChartData
            .map((item) => item.Savings)
            .reduce((acc, value) => acc + value, 0),
          color: "bg-emerald-500",
        },
      ],
    },
    {
      name: "Savings rate",
      data: barChartData ?? [],
      categories: ["Savings rate"],
      colors: ["violet"],
      valueFormatter: formatPercent,
      summary: [
        {
          name: "Average savings rate",
          total:
            barChartData
              .map((item) => item["Savings rate"])
              .reduce((acc, value) => acc + value, 0) / barChartData.length,
          color: "bg-violet-500",
        },
        {
          name: "Total savings rate",
          total:
            barChartData
              .map((item) => item.Savings)
              .reduce((acc, value) => acc + value, 0) /
            barChartData
              .map((item) => item.Incomes)
              .reduce((acc, value) => acc + value, 0),
          color: "bg-violet-500",
        },
      ],
    },
  ];

  return (
    <>
      <Card className="p-0 sm:mx-auto lg:col-span-3">
        <div className="p-6">
          <h3 className="font-medium text-gray-900">Statistics summary</h3>
          <p className="text-sm/6 text-gray-500">
            Get a clear view of your income, expenses, savings, and savings rate
            to track your financial progress.
          </p>
        </div>
        <div className="border-t border-gray-200 p-6">
          <Tabs defaultValue="Incomes vs Expenses">
            <div>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.name}
                    value={tab.name}
                    className="w-full"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabs.map((tab) => (
              <TabsContent key={tab.name} value={tab.name}>
                <ul
                  role="list"
                  className="mt-6 flex flex-wrap gap-x-20 gap-y-10"
                >
                  {tab.summary.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(
                            item.color,
                            "h-3 w-3 shrink-0 rounded-sm",
                          )}
                          aria-hidden={true}
                        />
                        <p className="font-semibold text-gray-900">
                          {tab.valueFormatter(item.total)}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm text-gray-500">
                        {item.name}
                      </p>
                    </li>
                  ))}
                </ul>{" "}
                <BarChart
                  data={tab.data}
                  index="date"
                  categories={tab.categories}
                  colors={tab.colors}
                  showLegend={false}
                  yAxisWidth={60}
                  valueFormatter={tab.valueFormatter}
                  className="mt-6 h-96"
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Card>
    </>
  );
}
