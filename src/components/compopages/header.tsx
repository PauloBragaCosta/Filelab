import Link from "next/link"
import {
  PlusCircle,
  Search,
} from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useCallback } from "react"
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Header() {

  const formSchema = z.object({
    itemCode: z.string().nonempty("Código do item é obrigatório.")
  });

  type FormData = z.infer<typeof formSchema>;


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCode: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
  }

  const handleKeyDown = useCallback((event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }, [form]);

  return (
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
  )
}