"use client"

import React, { useState } from 'react';
import {
  Check,
  Trash,
  Loader2,
  Plus,
  AlertCircle,
  Package2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockClosedIcon, LockOpen2Icon } from '@radix-ui/react-icons';
import { useItems } from '@/hooks/useItems';
import { toast, Toaster } from "sonner";
import Link from 'next/link';
import SessionMenu from '@/components/compopages/arquivo/SessionMenu';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';


export interface Item {
  itemCode: string;
  itemType: string;
  boxNumber: string;
  spaceNumber: string;
  examType: string;
  status: string;
};

const formSchema = z.object({
  itemCode: z.string().nonempty("Código do item é obrigatório."),
  itemType: z.string().nonempty("Tipo é obrigatório."),
  boxNumber: z.string().nonempty("Número da caixa é obrigatório."),
  spaceNumber: z.string().nonempty("Número da coluna é obrigatório."),
  examType: z.string().nonempty("Tipo de Exame é obrigatório."),
  status: z.string().nonempty("Status é obrigatório.")
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const { items } = useItems();
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [existingItems, setExistingItems] = useState<Item[]>([]);
  const [buttonVariant, setButtonVariant] = useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success">("default");
  const [buttonAddVariant, setbuttonAddVariant] = useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success">("default");
  const [buttonStatus, setButtonStatus] = useState("");
  const [disabledButton, setDisabledButton] = useState(true);
  const [itemTypeDefaut, setItemTypeDefaut] = useState("");
  const [examTypeDefaut, setExamTypeDefaut] = useState("");
  const [disabledForm, setDisabledForm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCode: "",
      itemType: itemTypeDefaut,
      boxNumber: "",
      spaceNumber: "",
      examType: examTypeDefaut,
      status: "arquivado",
    },
  });

  const { user, loading, auth } = useFirebaseAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null; // Isso impede que qualquer conteúdo seja renderizado enquanto redireciona
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const newItem = {
        itemCode: data.itemCode,
        itemType: data.itemType,
        boxNumber: data.boxNumber,
        spaceNumber: data.spaceNumber,
        examType: data.examType,
        status: "arquivado",
    };

    // Função para verificar se o item já existe em alguma lista
    const itemExists = (item: typeof newItem, list: typeof newItem[]): boolean => {
        return list.some(listItem => 
            listItem.itemCode === item.itemCode && listItem.itemType === item.itemType
        );
    };

    // Verifica na lista local e na lista do servidor
    if (itemExists(newItem, itemsList)) {
        setbuttonAddVariant("destructive");
        toast.error("Item com este código já existe em LISTA.");
        return;
    }

    if (itemExists(newItem, items)) {
        setbuttonAddVariant("destructive");
        if (newItem.itemType === "blocos") {
            toast.error("Item com este código já existe em bloco no SERVIDOR VERCEL.");
        } else if (newItem.itemType === "laminas") {
            toast.error("Item com este código já existe em lâmina no SERVIDOR VERCEL.");
        } else {
            toast.error("Item com este código já existe no SERVIDOR VERCEL.");
        }
        return;
    }

    // Se não existe em nenhuma lista, permite a inserção
    setItemsList((prevItems) => [...prevItems, newItem]);
    setItemTypeDefaut(data.itemType);
    setExamTypeDefaut(data.examType);
    setDisabledForm(true);
    setbuttonAddVariant("default");
    setDisabledButton(false);
    toast.success("Item adicionado com sucesso!");
};



  const handleSaveItems = async () => {
    try {
      setButtonStatus("Loading");
      setButtonVariant("default");
      setDisabledButton(true);

      const itemsToSave = itemsList.map(({ itemCode, itemType, boxNumber, spaceNumber, examType, status }) => ({
        itemCode,
        itemType,
        boxNumber,
        spaceNumber,
        examType,
        status,
      }));

      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        body: JSON.stringify({ items: itemsToSave, userCreated: user.name } ),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setButtonStatus("success");
        setButtonVariant("success");
        setDisabledButton(false);
        toast.success("Itens salvos com sucesso!");
      } else {
        const result = await response.json();
        setButtonVariant("destructive");
        setButtonStatus("Error");
        setDisabledButton(false);
        setExistingItems(result.existingItems || []);
        toast.error("Erro ao salvar itens. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error('Failed to save items', error);
      toast.error("Erro ao salvar itens. Por favor, tente novamente.");
    }
  };

  const handleDeleteItem = (itemCode: string) => {
    const updatedItems = itemsList.filter(item => item.itemCode !== itemCode);
    setItemsList(updatedItems);
    const hasExistingItems = updatedItems.some(item =>
      existingItems.some(existingItem => existingItem.itemCode === item.itemCode)
    );

    if (!hasExistingItems) {
      setButtonStatus("success");
      setButtonVariant("success");
      setDisabledButton(false);
    }
    toast.success("Item removido com sucesso!");
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Toaster />
      <div className="flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Package2 className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Cadastro</h1>
            </div>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Button onClick={handleSaveItems} variant={buttonVariant} disabled={disabledButton}>
                {buttonStatus === "success" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                ) : buttonStatus === "Loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando
                  </>
                ) : buttonStatus === "Error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Enviar novamente
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>

              <SessionMenu userName={user.name} userPhoto={user.photo} auth={auth} />
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Item Details</CardTitle>
              <Button
                onClick={() => setDisabledForm(!disabledForm)}
                variant="outline"
                size="icon"
              >
                {disabledForm ? (
                  <LockClosedIcon className="h-4 w-4" />
                ) : (
                  <LockOpen2Icon className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 items-end">
                  <FormField
                    control={form.control}
                    name="itemCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código do item</FormLabel>
                        <FormControl>
                          <Input placeholder="0000000" {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setbuttonAddVariant("default");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="itemType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select disabled={disabledForm} onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Bloco ou lâmina" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tipo</SelectLabel>
                              <SelectItem value="bloco">Bloco</SelectItem>
                              <SelectItem value="lamina">Lâmina</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="examType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Exame</FormLabel>
                        <Select disabled={disabledForm} onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Exames</SelectLabel>
                              <SelectItem value="patologia">Anatomia patológica</SelectItem>
                              <SelectItem value="hematologia">Hematologia</SelectItem>
                              <SelectItem value="citologia">Citologia</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="boxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da caixa</FormLabel>
                        <FormControl>
                          <Input placeholder="00" type="number" {...field} disabled={disabledForm} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spaceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da coluna</FormLabel>
                        <FormControl>
                          <Input placeholder="00" {...field} disabled={disabledForm} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant={buttonAddVariant} className="w-full">
                    <Check className="mr-2 h-4 w-4" /> Adicionar
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cadastrados recentemente</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Código do Item</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>nº Caixa</TableHead>
                      <TableHead>nº Coluna</TableHead>
                      <TableHead>Exame</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsList.slice().reverse().map((item) => {
                      const isExistingItem = existingItems.some(existingItem => existingItem.itemCode === item.itemCode);
                      return (
                        <TableRow key={item.itemCode}>
                          <TableCell className="font-medium">
                            {item.itemCode}
                            {isExistingItem && <Badge variant="destructive" className="ml-2">Já Cadastrado</Badge>}
                          </TableCell>
                          <TableCell>{item.itemType}</TableCell>
                          <TableCell>{item.boxNumber}</TableCell>
                          <TableCell>{item.spaceNumber}</TableCell>
                          <TableCell>{item.examType}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleDeleteItem(item.itemCode)}
                              variant="ghost"
                              size="icon"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
