"use client"
import React, { useCallback, useState } from 'react';
import {
  FileTextIcon,
  Check,
  Trash,
  Loader2,
  Plus,
  AlertCircle,

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
import Aside from "@/components/compopages/aside";
import Header from "@/components/compopages/header";

interface Item {
  itemCode: string;
  itemType: string;
  boxNumber: string;
  spaceNumber: string;
  examType: string;
  status: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [existingItems, setExistingItems] = useState<Item[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonVariant, setButtonVariant] = useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success">("default");
  const [buttonStatus, setButtonStatus] = useState("");
  const [disabledButton, setDisabledButton] = useState(true);

  const formSchema = z.object({
    itemCode: z.string().nonempty("Código do item é obrigatório."),
    itemType: z.string().nonempty("Tipo é obrigatório."),
    boxNumber: z.string().nonempty("Número da caixa é obrigatório."),
    spaceNumber: z.string().nonempty("Número da coluna é obrigatório."),
    examType: z.string().nonempty("Tipo de Exame é obrigatório."),
    status: z.string().nonempty("Status é obrigatório.")
  });

  type FormData = z.infer<typeof formSchema>;

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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setItemTypeDefaut(data.itemType)
    setExamTypeDefaut(data.examType)
    setDisabledForm(true)

    setButtonStatus("success");
    setButtonVariant("success");
    setDisabledButton(false);
    console.log("Form data submitted:", data);
    if (items.some(item => item.itemCode === data.itemCode)) {
      console.log("Item com este código já existe.");
    } else {
      const newItem = {
        itemCode: data.itemCode,
        itemType: data.itemType,
        boxNumber: data.boxNumber,
        spaceNumber: data.spaceNumber,
        examType: data.examType,
        status: "arquivado",
      };

      setItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const handleSaveItems = async () => {
    try {
      setButtonStatus("Loading");
      setButtonVariant("default");
      setDisabledButton(true);

      const itemsToSave = items.map(({ itemCode, itemType, boxNumber, spaceNumber, examType, status }) => ({
        itemCode,
        itemType,
        boxNumber,
        spaceNumber,
        examType,
        status,
      }));

      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        body: JSON.stringify({ items: itemsToSave }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        const { count } = result;

        setButtonStatus("success");
        setButtonVariant("success");
        setDisabledButton(false);
      } else {
        const result = await response.json();
        setButtonVariant("destructive");
        setButtonStatus("Error");
        setDisabledButton(false);
        setExistingItems(result.existingItems || []);
      }
    } catch (error) {
      console.error('Failed to save items', error);
    }
  };

  const handleDeleteItem = (itemCode: string) => {
    const updatedItems = items.filter(item => item.itemCode !== itemCode);
    setItems(updatedItems);
    const hasExistingItems = updatedItems.some(item =>
      existingItems.some(existingItem => existingItem.itemCode === item.itemCode)
    );

    if (!hasExistingItems) {
      setButtonStatus("success");
      setButtonVariant("success");
      setDisabledButton(false);
    }
  };

  const handleKeyDown = useCallback((event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }, [form]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Aside />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

        <div className="flex-1 space-y-4 p-4 pt-0 md:p-6 md:pt-0">
          <div className="space-between flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Cadastro</h1>
            <Button className="ml-auto" onClick={handleSaveItems} variant={buttonVariant} disabled={disabledButton}>
              {buttonStatus === "success" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  salvar
                </>
              ) : buttonStatus === "Loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  carregando
                </>
              ) : buttonStatus === "Error" ? (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  enviar novamente
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  salvar
                </>
              )}
            </Button>

          </div>
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Item Details</CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    <FormField
                      control={form.control}
                      name="itemCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código do item</FormLabel>
                          <FormControl>
                            <Input placeholder="0000000" {...field} />
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
                          <FormControl>
                            <Select disabled={disabledForm} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Bloco ou lâmina" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Tipo</SelectLabel>
                                  <SelectItem value="bloco">Bloco</SelectItem>
                                  <SelectItem value="lamina">Lâmina</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
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
                          <FormControl>
                            <Select disabled={disabledForm} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Exames</SelectLabel>
                                  <SelectItem value="patologia">Anatomia patológica</SelectItem>
                                  <SelectItem value="hematologia">Hematologia</SelectItem>
                                  <SelectItem value="citologia">Citologia</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
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
                    <Button type="submit" className="flex items-center"><Check /> Adicionar</Button>
                  </form>
                </Form>
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
                    <TableHead>Código do Item</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>nº Caixa</TableHead>
                    <TableHead>nº Coluna</TableHead>
                    <TableHead>Exame</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const isExistingItem = existingItems.some(existingItem => existingItem.itemCode === item.itemCode);
                    return (
                      <TableRow key={item.itemCode}>
                        <TableCell className="font-medium">
                          {item.itemCode}
                          {isExistingItem && <Badge variant="destructive">Já Cadastrado</Badge>}
                        </TableCell>
                        <TableCell>{item.itemType}</TableCell>
                        <TableCell>{item.boxNumber}</TableCell>
                        <TableCell>{item.spaceNumber}</TableCell>
                        <TableCell>{item.examType}</TableCell>
                        <TableCell>
                          <Button
                            className="p-0 h-5 w-5 bg-transparent"
                            variant="secondary"
                            onClick={() => handleDeleteItem(item.itemCode)}
                          >
                            <Trash className="h-4 w-4 text-black" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
