"use client"
import { useEffect, useState } from 'react';
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
import { Skeleton } from '../ui/skeleton';

interface Item {
    itemCode: string;
    itemType: string;
    examType: string;
    status: string;
    createdAt: Date;
}

interface OverviewData {
    items: Item[];
    countbloco: number;
    countlaminas: number;
    blocoChange: string;
    laminasChange: string;
}

export default function VisaoGeral() {
    const [data, setData] = useState<OverviewData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    async function fetchOverviewData() {
        try {
            const response = await fetch('/api/tasks/overview', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const overviewData: OverviewData = await response.json();
            setData(overviewData);
        } catch (error) {
            console.error('Error fetching overview data:', error);
            setError(error as Error);
        }
    }

    useEffect(() => {
        fetchOverviewData();
    }, []);

    if (error) {
        return <div>Erro ao carregar os dados: {error.message}</div>;
    }

    if (!data) {
        return (
            <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de blocos arquivados
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de lâminas arquivadas
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pedidos de retiradas
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Blocos e laminas pesquisados</CardTitle>
                            <File className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"><Skeleton className="h-5 w-[60px]" /></div>
                            <p className="animate-pulse text-xs text-muted-foreground">
                                Carregando
                            </p>
                        </CardContent>
                    </Card>
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
                                    <TableHead>exame</TableHead>
                                    <TableHead>tipo</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow >
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                </TableRow>
                                <TableRow >
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[50px]" /></TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card>
            </>
        );
    }

    const { items, countbloco, countlaminas, blocoChange, laminasChange } = data;

    // Ordena os itens em ordem crescente de itemCode
    const sortedItems = items.sort((a, b) => b.itemCode.localeCompare(a.itemCode));

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de blocos arquivados
                        </CardTitle>
                        <File className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{countbloco}</div>
                        <p className="text-xs text-muted-foreground">
                            {blocoChange}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de lâminas arquivadas
                        </CardTitle>
                        <File className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            +{countlaminas}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {laminasChange} 
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pedidos de retiradas
                        </CardTitle>
                        <File className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                            +19% do mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blocos e laminas pesquisados</CardTitle>
                        <File className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 desde a última hora
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Cadastrados recentemente</CardTitle>
                    <CardDescription>últimos {items.length} registros.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID do item</TableHead>
                                <TableHead>exame</TableHead>
                                <TableHead>tipo</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedItems.map((item) => (
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
        </>
    );
}
