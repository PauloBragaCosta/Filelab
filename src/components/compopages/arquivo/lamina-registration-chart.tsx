"use client"

import { useMemo } from 'react'
import { Bar, BarChart, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import type { Item } from '@/types/item'

interface LaminaRegistrationChartProps {
  items: Item[]
}

export default function LaminaRegistrationChart({ items }: LaminaRegistrationChartProps) {
  const { chartData, totalLaminas } = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const laminasData = items
      .filter(item => item.itemType === 'lamina')
      .reduce((acc, item) => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, count: 0 };
        }
        acc[date].count += 1;
        return acc;
      }, {} as Record<string, { date: string, count: number }>);

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      return laminasData[dateString] || { date: dateString, count: 0 };
    });

    const totalLaminas = items.filter(item => item.itemType === 'lamina').length;

    return { chartData, totalLaminas };
  }, [items]);

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Lâminas Cadastradas</CardTitle>
        <CardDescription>
          Total de lâminas registradas no sistema até o momento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          {totalLaminas.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">
            lâminas
          </span>
        </div>
        <ChartContainer
          config={{
            laminas: {
              label: "Lâminas",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="ml-auto w-[72px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={chartData}
          >
            <Bar
              dataKey="count"
              fill="var(--color-laminas)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}