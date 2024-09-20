"use client"

import React, { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { File } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export interface Item {
  createdAt: string | number | Date;
  itemCode: string;
  itemType: string;
  boxNumber: string;
  spaceNumber: string;
  examType: string;
  status: string;
};

interface VisaoGeralProps {
  items: Item[]
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  blocos: {
    label: "Blocos",
    color: "hsl(var(--primary))",
  },
  laminas: {
    label: "Lâminas",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig

export default function VisaoGeral({ items }: VisaoGeralProps) {
  const { countBlocos, countLaminas, itemTypeCounts, chartData } = useMemo(() => {
    const countBlocos = items.filter(item => item.itemType === 'bloco').length
    const countLaminas = items.filter(item => item.itemType === 'lamina').length
    const itemTypeCounts = items.reduce((acc, item) => {
      acc[item.itemType] = (acc[item.itemType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Transforming items into chartData
    const groupedData = items.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().split('T')[0]; // Extract date part
      acc[date] = acc[date] || { date, blocos: 0, laminas: 0 };
      if (item.itemType === 'bloco') {
        acc[date].blocos += 1;
      } else if (item.itemType === 'lamina') {
        acc[date].laminas += 1;
      }
      return acc;
    }, {} as Record<string, { date: string, blocos: number, laminas: number }>);

    const chartData = Object.values(groupedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { countBlocos, countLaminas, itemTypeCounts, chartData }
  }, [items])

  const [timeRange, setTimeRange] = useState("90d")

  const filteredData = chartData.filter((item: { date: string | number | Date }) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard title="Total de blocos arquivados" value={countBlocos} change="+10%" />
        <OverviewCard title="Total de lâminas arquivadas" value={countLaminas} change="+15%" />
        <OverviewCard title="Pedidos de retiradas" value={12234} change="+19% do mês passado" />
        <OverviewCard title="Blocos e lâminas pesquisados" value={573} change="+201 desde a última hora" />
      </div>
      <Card>
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Gráfico de Área - Interativo</CardTitle>
              <CardDescription>
                Mostrando total de blocos e lâminas para os últimos 3 meses
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Selecione um valor"
              >
                <SelectValue placeholder="Últimos 3 meses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Últimos 3 meses
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Últimos 30 dias
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Últimos 7 dias
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillBlocos" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-blocos)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-blocos)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillLaminas" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-laminas)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-laminas)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("pt-BR", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="laminas"
                  type="natural"
                  fill="url(#fillLaminas)"
                  stroke="var(--color-laminas)"
                  stackId="a"
                />
                <Area
                  dataKey="blocos"
                  type="natural"
                  fill="url(#fillBlocos)"
                  stroke="var(--color-blocos)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </Card>
    </div>
  )
}

function OverviewCard({ title, value, change }: { title: string; value: number; change: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <File className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  )
}


