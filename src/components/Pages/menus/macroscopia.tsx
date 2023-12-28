import { ComboboxDemo } from "@/components/ui/Combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "lucide-react";

export default function Macroscopia() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Procedimento
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">n°</TableHead>

                                    <TableHead>Procedimento médico</TableHead>
                                    <TableHead className="text-right">Complexidade</TableHead>
                                    <TableHead className="text-right">Lixeira</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">01</TableCell>

                                    <TableCell>
                                        <ComboboxDemo />
                                    </TableCell>
                                    <TableCell className="text-right">Baixa</TableCell>
                                    <TableCell className="text-right"><TrashIcon className="grid justify-items-end h-4 w-4 text-muted-foreground" /></TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
            <div className="grid gap-4 grid-cols-2">
                <div className="space-y-4">
                    <Card className="col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Topografias procedimento
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">n°</TableHead>

                                        <TableHead>Topografias</TableHead>
                                        <TableHead className="text-right">Reserva</TableHead>
                                        <TableHead className="text-right">Lixeira</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">01</TableCell>

                                        <TableCell>
                                            <ComboboxDemo />
                                        </TableCell>
                                        <TableCell className="text-right">Baixa</TableCell>
                                        <TableCell className="text-right"><TrashIcon className="grid justify-items-end h-4 w-4 text-muted-foreground" /></TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Parecer Macroscópico da Topografia
                            </CardTitle>

                        </CardHeader>
                        <Textarea />
                    </Card>
                </div>
                <div>
                    <Card className="col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cassetes
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">n°</TableHead>

                                        <TableHead className="text-right">Controle</TableHead>
                                        <TableHead className="text-right">n° de fragmentos</TableHead>

                                        <TableHead className="text-right">Mapeamento</TableHead>
                                        <TableHead className="text-right">Lixeira</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">01</TableCell>
                                        <TableCell className="font-medium">000000000</TableCell>
                                        <TableCell className="font-medium">01</TableCell>
                                        <TableCell>
                                            <ComboboxDemo />
                                        </TableCell>
                                        <TableCell className="text-right">&&</TableCell>
                                        <TableCell className="text-right"><TrashIcon className="grid justify-items-end h-4 w-4 text-muted-foreground" /></TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}