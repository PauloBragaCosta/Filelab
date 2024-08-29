"use client";

import React from 'react';
import { File } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Item } from '@/types/item';

interface VisaoGeralProps {
    items: Item[];
}

export default function VisaoGeral({ items }: VisaoGeralProps) {
    if (items.length === 0) {
        return <LoadingSkeleton />;
    }

    // Cálculos para blocos e lâminas
    const countbloco = items.filter(item => item.itemType === 'bloco').length;
    const countlaminas = items.filter(item => item.itemType === 'lamina').length;

    // Exemplo de lógica para calcular as mudanças percentuais
    const blocoChange = "+10%"; // Substitua por lógica real se disponível
    const laminasChange = "+15%"; // Substitua por lógica real se disponível

    const sortedItems = [...items].sort((a, b) => b.itemCode.localeCompare(a.itemCode));

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <OverviewCard
                    title="Total de blocos arquivados"
                    value={countbloco}
                    change={blocoChange}
                />
                <OverviewCard
                    title="Total de lâminas arquivadas"
                    value={countlaminas}
                    change={laminasChange}
                />
                <OverviewCard
                    title="Pedidos de retiradas"
                    value={12234}
                    change="+19% do mês passado"
                />
                <OverviewCard
                    title="Blocos e lâminas pesquisados"
                    value={573}
                    change="+201 desde a última hora"
                />
            </div>
            <RecentItemsTable items={sortedItems} />
        </>
    );
}

function OverviewCard({ title, value, change }: { title: string; value: number; change: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {change}
                </p>
            </CardContent>
        </Card>
    );
}

function RecentItemsTable({ items }: { items: Item[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cadastrados recentemente</CardTitle>
                <CardDescription>Últimos {items.length} registros.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID do item</TableHead>
                            <TableHead>Exame</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.itemCode}>
                                <TableCell className="font-medium">{item.itemCode}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.examType}</Badge>
                                </TableCell>
                                <TableCell>{item.itemType}</TableCell>
                                <TableCell className="text-right">{item.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function LoadingSkeleton() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-[200px]" />
                            </CardTitle>
                            <File className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"><Skeleton className="h-5 w-[60px]" /></div>
                            <p className="animate-pulse text-xs text-muted-foreground">
                                Carregando
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Cadastrados recentemente</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID do item</TableHead>
                                <TableHead>Exame</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(4)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
