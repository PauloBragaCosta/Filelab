"use client";
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Aside from "@/components/compopages/aside";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  File,
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Check,
  ChevronsUpDown,
} from "lucide-react";
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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from 'next/navigation';
import { RegisterLog } from '@/components/compopages/registerLog';
import VisãoGeral from '@/components/compopages/home';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Item {
  itemCode: string;
  itemType: string;
  boxNumber: string;
  spaceNumber: string;
  examType: string;
  createdAt: string;
  status: string;
}

interface CommandDialogsearchProps {
  items: Item[];
  onSelectItem: (iditem: string) => void; // Corrigido para ser uma função que recebe uma string
}


export default function Home() {
  const [itemsList, setItemsList] = useState<Item[]>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch('/api/tasks/overview');
        const data = await response.json();
        setItemsList(data.items);
        console.log(data.items)
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };
    fetchOverview();
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [itemCode, setitemCode] = useState("");
  const [itemType, setitemType] = useState("");
  const [boxNumber, setboxNumber] = useState("");
  const [spaceNumber, setspaceNumber] = useState("");
  const [examType, setexamType] = useState("");
  const [status, setstatus] = useState("");
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

  const [BoxSpace, setBoxSpace] = useState<Item[]>([]);
  const [ItemStatusLogs, setItemStatusLogs] = useState<ItemStatusLogData[]>([]);
  const [error, setError] = useState<string | null>(null);

  interface ItemStatusLogData {
    id: string;
    itemCode: string;
    UserCreated: string;
    observation: string;
    status: string;
    createdAt: Date;
  }

  async function fetchItemsByBoxSpaceType(boxNumber: string, spaceNumber: string, itemType: string): Promise<Item[]> {
    try {
      const responseBoxSpace = await fetch('/api/tasks/searchByBoxSpaceType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boxNumber, spaceNumber, itemType }),
      });

      if (!responseBoxSpace.ok) {
        throw new Error(`HTTP error! status: ${responseBoxSpace.status}`);
      }

      const items = await responseBoxSpace.json();
      setBoxSpace(items);

      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      setBoxSpace([]);
      return [];
    }
  }

  async function fetchItemStatusLogsByItemCode(itemCode: string): Promise<ItemStatusLogData[]> {
    try {
      const response = await fetch('/api/tasks/searchItemStatusLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const logs = await response.json();
      setItemStatusLogs(logs);
      return logs;
    } catch (error) {
      console.error('Error fetching item status logs:', error);
      setItemStatusLogs([]);
      return [];
    }
  }


  useEffect(() => {
    if (tabsTriggerRefs.current[selectedTab]) {
      tabsTriggerRefs.current[selectedTab]?.click();
    }
  }, [selectedTab]);

  const handleSelectItem = (iditem: string) => {
    setitemCode(iditem)
    fetchItemStatusLogsByItemCode(iditem)
    console.log("Item selecionado com id:", iditem);

    // Buscar o item na lista itemsList
    const selectedItem = itemsList.find((item) => item.itemCode === iditem);

    // Verificar se o item foi encontrado
    if (selectedItem) {
      setSelectedTab(selectedItem.itemType);
      setitemType(selectedItem.itemType);
      setboxNumber(selectedItem.boxNumber);
      setspaceNumber(selectedItem.spaceNumber);
      setexamType(selectedItem.examType);
      setstatus(selectedItem.status);

      fetchItemsByBoxSpaceType(selectedItem.boxNumber, selectedItem.spaceNumber, selectedItem.itemType)


      // Aqui você pode adicionar lógica adicional para atualizar o estado do componente pai ou realizar outras ações
    } else {
      console.log("Item não encontrado na lista.");
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside />


      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Arquivo de blocos e lâminas</h1>


          <CommandDialogsearch items={itemsList} onSelectItem={handleSelectItem} />
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
                      Numero do bloco
                    </CardTitle>
                    <File className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{itemCode}</div>
                  </CardContent>
                </Card>
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


export function CommandDialogsearch({
  items,
  onSelectItem,
}: CommandDialogsearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (currentValue: string) => {
    const selectedItem = items.find((item) => item.itemCode === currentValue);
    if (selectedItem) {
      setValue(currentValue === value ? "" : currentValue);
      setOpen(false);
      onSelectItem(selectedItem.itemCode);
    }
  };

  const handleButtonClick = () => {
    setOpen(true);
  };

  // Função de normalização para ajudar na ordenação
  const normalizeCode = (code: string) => {
    return code.replace(/-/g, "").padStart(10, "0");
  };

  // Ordenando os itens em ordem crescente, considerando a normalização dos códigos
  const sortedItems = [...items].sort((a, b) =>
    normalizeCode(a.itemCode).localeCompare(normalizeCode(b.itemCode))
  );

  return (
    <>
      <Button variant="outline" onClick={handleButtonClick} className="relative ml-auto flex-1 md:grow-0">
        <div className="flex w-full gap-20 md:w-auto">
          <div className="gap-20">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <span className="ml-8 md:ml-2">Search...</span>
          </div>
          <p className="hidden md:flex text-sm text-muted-foreground items-center ml-2">
            Press{" "}
            <kbd className="ml-1 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>J
            </kbd>
          </p>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {sortedItems.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => handleSelect(item.itemCode)}
              >
                {item.itemCode}
                <CommandShortcut>{item.itemType}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

