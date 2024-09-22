






"use client"

import { useMemo } from 'react'
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label, XAxis, Area, YAxis, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Item } from '@/types/item'

interface TaxaUtilizacaoCardProps {
  items: Item[]
}

export default function TaxaUtilizacaoCard({ items }: TaxaUtilizacaoCardProps) {
  const { chartData, taxaUtilizacao, totalItens, itensEmUso, tendencia } = useMemo(() => {
    const totalItens = items.length;
    const itensEmUso = items.filter(item => item.status === 'arquivado').length;
    const taxaUtilizacao = (itensEmUso / totalItens) * 100;

    const chartData = [
      { name: 'arquivado', value: taxaUtilizacao },
      { name: 'Disponíveis', value: 100 - taxaUtilizacao },
    ];

    // Simulating a trend calculation
    const tendencia = taxaUtilizacao > 50 ? 5.2 : -3.1;

    return { chartData, taxaUtilizacao, totalItens, itensEmUso, tendencia };
  }, [items]);

  const chartConfig = {
    emUso: {
      label: "Arquivado",
      color: "hsl(var(--chart-3))",
    },
    disponiveis: {
      label: "Não arquivado",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <Card className=" relative overflow-hidden">
      {/* Gráfico como fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <ChartContainer
          config={{
            time: {
              label: "Time",
              color: "hsl(140 74% 44%)",
            },
          }}
        >
          <AreaChart
            width={300} // Defina a largura para coincidir com o card
            height={120} // Defina uma altura específica para o gráfico
            data={[
              { date: "2024-01-01", time: 8.5 },
              { date: "2024-01-02", time: 7.2 },
              { date: "2024-01-03", time: 8.1 },
              { date: "2024-01-04", time: 6.2 },
              { date: "2024-01-05", time: 6.0 },
              { date: "2024-01-06", time: 8.1 },
              { date: "2024-01-07", time: 7.0 },
            ]}

            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" hide />
            <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
            <defs>
              <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-time)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-time)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="time"
              type="natural"
              fill="url(#fillTime)"
              fillOpacity={0.4}
              stroke="var(--color-time)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Conteúdo sobreposto ao gráfico */}
      <div className="relative z-10">
        <CardHeader className="space-y-0 pb-0">
          <CardTitle>
            {itensEmUso} de {totalItens} itens estão arquivados nesse momento
          </CardTitle>

          <CardDescription>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <span>
                  {tendencia > 0 ? 'Aumento' : 'Redução'} de {Math.abs(tendencia)}% neste mês
                </span>
                <TrendingUp
                  className={`h-4 w-4 ${tendencia > 0 ? 'text-green-500' : 'text-red-500'}`}
                />
              </div>

              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              </span>
            </div>
          </CardDescription>

        </CardHeader>

        <CardContent className="p-0" />
      </div>
    </Card>




  )
}
