// 'use client';
import { Card, DonutChart, List, ListItem } from '@tremor/react';
import { formatCurrency } from '~/utils/helpers';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type DataType = {
  name: string;
  value: number;
};

export default function DonutChartContainer({ data }: {
  data?: DataType[];
}) {
  return (
    <>
      <Card className="sm:mx-auto lg:col-span-2">
        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Total expenses by category
        </h3>
        <DonutChart
          className="mt-8"
          data={data ?? []}
          index="name"
          valueFormatter={formatCurrency}
          colors={['cyan', 'blue', 'indigo', 'violet', 'fuchsia']}
        />
        <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
          <span>Category</span>
          <span>Amount</span>
        </p>
        <List className="mt-2">
          {data?.map((item) => (
            <ListItem key={item.name} className="space-x-6">
              <div className="flex items-center space-x-2.5 truncate">
                <span
                  className={classNames(
                    // item.color,
                    'h-2.5 w-2.5 shrink-0 rounded-sm',
                  )}
                  aria-hidden={true}
                />
                <span className="truncate dark:text-dark-tremor-content-emphasis">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {formatCurrency(item.value)}
                </span>
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
