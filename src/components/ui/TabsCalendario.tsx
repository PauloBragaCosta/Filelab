import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    FormControl,
} from "@/components/ui/form"

import {
    CalendarIcon,
} from "@radix-ui/react-icons"

import React, { useState } from "react"
import { Calendar } from "./calendar"
import { addDays, addMonths, addYears, differenceInDays, differenceInMonths, differenceInYears, format, subDays, subMonths, subYears } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { ptBR } from "date-fns/locale"


export function TabsCalendario({
    IDFather,
    onStatusChange,
}: {
    IDFather: Date | undefined
    onStatusChange: (status: Date | undefined) => void

}) {
    const [disabledfieldany, setdisabled] = React.useState(false)
    const [open, setOpen] = React.useState(false)




    // Suponha que a data selecionada seja armazenada na variável selectedDate
    let currentDate = new Date()

    const [selectedDate, setSelectedDate] = useState<Date>(currentDate)

    React.useEffect(() => {
        if (IDFather) {
            setSelectedDate(IDFather)
        }
    }, [IDFather]);

    React.useEffect(() => {
        onStatusChange(selectedDate)
    }, [selectedDate]);


    //setSelectedDate(field.value)

    // Data atual

    // Suponha que os anos, meses e dias sejam fornecidos nas variáveis yearInput, monthInput e dayInput
    const [yearInput, setyearInput] = useState(0); // valor do input de anos
    const [monthInput, setmonthInput] = useState(0);  // valor do input de meses
    const [dayInput, setdayInput] = useState(0); // valor do input de dias

    // Calcular a diferença em anos, meses e dias
    let years = differenceInYears(currentDate, selectedDate)
    let months = differenceInMonths(currentDate, selectedDate) % 12
    let days = differenceInDays(currentDate, selectedDate) % 365 % 30

    React.useEffect(() => {
        setyearInput(years)
        setmonthInput(months)
        setdayInput(days)


        //setdisabled(true)


    }, [selectedDate]);

    // Calcular a data






    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const numericValue = parseInt(value)
        if (event.currentTarget.id === "ano") {
            setyearInput(numericValue | 0)
        }
        if (event.currentTarget.id === "mes") {
            setmonthInput(numericValue | 0)
        }
        if (event.currentTarget.id === "dia") {
            setdayInput(numericValue | 0)
        }


    };

    async function calculo() {
        const calculatedDate = subDays(subMonths(subYears(currentDate, yearInput), monthInput), dayInput);
        console.log(calculatedDate)
        console.log(monthInput)

        console.log(dayInput)

        setSelectedDate(calculatedDate)
    }


    return (
        <Tabs defaultValue="calendário" className="w-35">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendário">formato de calendário</TabsTrigger>
                <TabsTrigger value="detalhado">Estimativa detalhado</TabsTrigger>
            </TabsList>
            <TabsContent value="calendário">
                <Card>
                    <CardHeader>
                        <CardTitle>Data</CardTitle>
                        <CardDescription>
                            A data de nascimento é usada para calcular a idade do animal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        aria-expanded={open}
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        {selectedDate ? (
                                            format(new Date(selectedDate), "PP", { locale: ptBR })
                                        ) : (
                                            <span>Escolha uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    locale={ptBR}
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={date => {
                                        if (date instanceof Date) {
                                            setSelectedDate(date);
                                        }
                                    }}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost"
                            onClick={(event) => {
                                event.preventDefault();
                                calculo();
                            }}>Salvar data</Button>
                    </CardFooter>

                </Card>
            </TabsContent>
            <TabsContent value="detalhado">
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhado</CardTitle>
                        <CardDescription>
                            Escreva de forma descritiva a quantidade de anos, mês e dia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                        <div className="flex items-center gap-2">
                            <Input disabled={disabledfieldany} id="ano" value={yearInput} className="relative flex h-9 w-[4.5rem] items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md" placeholder="00" type="number" minLength={1} maxLength={2} onInput={handleInput} />
                            <Label htmlFor="ano">Ano(s)</Label>
                            <h1>-</h1>
                            <Input disabled={disabledfieldany} id="mes" value={monthInput} className="relative flex h-9 w-[4.5rem] items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md" placeholder="00" type="number" minLength={1} maxLength={2} onInput={handleInput} />
                            <Label htmlFor="mes">Mês(es)</Label>
                            <h1>-</h1>
                            <Input disabled={disabledfieldany} id="dia" value={dayInput} className="relative flex h-9 w-[4.5rem] items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md" placeholder="00" type="number" minLength={1} maxLength={2} onInput={handleInput} />
                            <Label htmlFor="dia">Dia(s)</Label>

                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost"
                            onClick={(event) => {
                                event.preventDefault();
                                calculo();
                            }}>Salvar data</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
