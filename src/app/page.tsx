"use client";
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Aside from "@/components/compopages/aside";
import Link from "next/link";
import { PlusCircle, Search, File } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from 'next/navigation';
import { RegisterLog } from '@/components/compopages/registerLog';
import VisãoGeral from '@/components/compopages/home';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extrair parâmetros de consulta da URL
  const itemCode = searchParams?.get('itemCode');
  const itemType = searchParams?.get('itemType');
  const boxNumber = searchParams?.get('boxNumber');
  const spaceNumber = searchParams?.get('spaceNumber');
  const examType = searchParams?.get('examType');
  const createdAt = searchParams?.get('createdAt');
  const status = searchParams?.get('status');

  const [selectedTab, setSelectedTab] = useState(itemType || "overview");
  const tabsTriggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const formSchema = z.object({
    itemCode: z.string().nonempty("Código do item é obrigatório."),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCode: "",
    },
  });

  interface Item {
    itemCode: string;
    itemType: string;
    boxNumber: string;
    spaceNumber: string;
    examType: string;
    createdAt: string;
    status: string;
  }

  const [itemData, setItemData] = useState<Item>({
    itemCode: '00',
    itemType: 'unknown',
    boxNumber: '00',
    spaceNumber: '00',
    examType: 'unknown',
    createdAt: new Date().toISOString(),
    status: 'unknown',
  });

  interface ItemData {
    itemCode: string;
    examType: string;
    status: string;
  }

  interface ItemStatusLogData {
    id: string;
    itemCode: string;
    UserCreated: string;
    observation: string;
    status: string;
    createdAt: Date;
  }

  const [BoxSpace, setBoxSpace] = useState<ItemData[]>([]);
  const [ItemStatusLogs, setItemStatusLogs] = useState<ItemStatusLogData[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchItemsByBoxSpaceType(boxNumber: string, spaceNumber: string, itemType: string): Promise<ItemData[]> {
    try {
      const responseBoxSpace = await fetch(`/api/tasks/searchByBoxSpaceType?boxNumber=${boxNumber}&spaceNumber=${spaceNumber}&itemType=${itemType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!responseBoxSpace.ok) {
        throw new Error(`HTTP error! status: ${responseBoxSpace.status}`);
      }

      const itemsresponseBoxSpace: ItemData[] = await responseBoxSpace.json();
      setBoxSpace(itemsresponseBoxSpace);
      return itemsresponseBoxSpace;
    } catch (error) {
      console.error('Error fetching items:', error);
      setBoxSpace([]);
      return [];
    }
  }

  async function fetchItemStatusLogsByItemCode(itemCode: string): Promise<ItemStatusLogData[]> {
    try {
      const response = await fetch(`/api/tasks/searchItemStatusLogs?itemCode=${itemCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const itemStatusLogs: ItemStatusLogData[] = await response.json();
      setItemStatusLogs(itemStatusLogs);
      return itemStatusLogs;
    } catch (error) {
      console.error('Error fetching item status logs:', error);
      setItemStatusLogs([]);
      return [];
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const itemStatusLogs = await fetchItemStatusLogsByItemCode(data.itemCode);
      if (itemStatusLogs.length === 0) {
        throw new Error('No logs found for the item');
      }
  
      const url = `/api/tasks/search?itemCode=${data.itemCode}`;
      console.log("Fetching from URL:", url); // Adicionado para debug
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const item = await response.json();
      setItemData(item);
      setSelectedTab(item.itemType);
      await fetchItemsByBoxSpaceType(item.boxNumber, item.spaceNumber, item.itemType);
  
      const query = new URLSearchParams(item).toString();
      router.push(`/?${query}`);
  
      if (tabsTriggerRefs.current[item.itemType]) {
        tabsTriggerRefs.current[item.itemType]?.click();
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
      setError('An error occurred while fetching data');
    }
  };
  

  const handleKeyDown = useCallback((event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }, [form]);

  useEffect(() => {
    if (tabsTriggerRefs.current[selectedTab]) {
      tabsTriggerRefs.current[selectedTab]?.click();
    }
  }, [selectedTab]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside />


      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Arquivo de blocos e lâminas</h1>

          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="relative ml-auto flex-1 md:grow-0">
              <FormField
                control={form.control}
                name="itemCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative ml-auto flex-1 md:grow-0">
                        <Input
                          type="search"
                          placeholder="Search..."
                          {...field}
                          className="w-full rounded-lg bg-background pr-9 md:w-[200px] lg:w-[336px]"
                        />
                        <Button type="submit" className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0 bg-transparent border-none">
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button asChild>
            <Link href="/register">
              <PlusCircle className="mr-2 h-4 w-4" />
              Fazer arquivamento
            </Link>
          </Button>
        </header>

        <div className="flex-1 space-y-4 p-4 pt-0 md:p-6 md:pt-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList>
              <TabsTrigger
                value="overview"
                ref={(el) => { tabsTriggerRefs.current["overview"] = el; }}
              >
                Visão geral
              </TabsTrigger>
              <TabsTrigger
                value="bloco"
                disabled
                ref={(el) => { tabsTriggerRefs.current["bloco"] = el; }}
              >
                Blocos
              </TabsTrigger>
              <TabsTrigger
                value="lamina"
                disabled
                ref={(el) => { tabsTriggerRefs.current["lamina"] = el; }}
              >
                Lâminas
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
                ref={(el) => { tabsTriggerRefs.current["notifications"] = el; }}
              >
                Expurgo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <VisãoGeral />
            </TabsContent>
            <TabsContent value="bloco" className="space-y-4" >

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Caixa
                    </CardTitle>
                    <File className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{boxNumber}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Coluna
                    </CardTitle>
                    <File className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{spaceNumber}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tipo de exame
                    </CardTitle>
                    <File className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{examType}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Status atual
                    </CardTitle>
                    <File className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{status}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-0 md: md:pt-0">
                <Card className="flex-1 space-y-4">
                  <CardHeader>
                    <CardTitle>Itens da mesma coluna</CardTitle>
                    <CardDescription>contem {BoxSpace.length} registros</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>exame</TableHead>
                          <TableHead>status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {BoxSpace.map((BoxSpace) => (
                          <TableRow key={BoxSpace.itemCode}>
                            <TableCell>{BoxSpace.itemCode}</TableCell>
                            <TableCell>{BoxSpace.examType}</TableCell>
                            <TableCell>{BoxSpace.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="flex-[2] space-y-4">
                  <CardHeader className="px-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Item Status Logs</CardTitle>
                        <CardDescription>Recent item status updates.</CardDescription>
                      </div>
                      <RegisterLog />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Observation</TableHead>
                          <TableHead className="hidden md:table-cell">Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ItemStatusLogs.map((ItemStatusLogs) => (
                          <TableRow key={ItemStatusLogs.id}>
                            <TableCell>{ItemStatusLogs.id}</TableCell>
                            <TableCell>{ItemStatusLogs.UserCreated}</TableCell>
                            <TableCell>{ItemStatusLogs.status}</TableCell>
                            <TableCell>{ItemStatusLogs.observation}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

              </div>

            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              {/* <Reports /> */}
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              {/* <Notifications /> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
