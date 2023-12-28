import { TrashIcon } from "@radix-ui/react-icons"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../ui/tabs"
import { Textarea } from "../../ui/textarea"
import { ComboboxDemo } from "../../ui/Combobox"
import Macroscopia from "./macroscopia"
import Imagens from "./imagens"


export default function Nav() {
    return (
        <div className="col-start-2 col-span-10 mx-10">
            <Tabs defaultValue="Imagens" className="space-y-4 ">
                <TabsList>
                    <TabsTrigger value="Imagens" >
                        Imagens
                    </TabsTrigger>
                    <TabsTrigger value="Admissão" >
                        Admissão
                    </TabsTrigger>
                    <TabsTrigger value="Macroscopia" >
                        Macroscopia
                    </TabsTrigger>
                    <TabsTrigger value="Histotecnica" disabled>
                        Histotecnica
                    </TabsTrigger>
                    <TabsTrigger value="Microscopia" disabled>
                        Microscopia
                    </TabsTrigger>
                    <TabsTrigger value="Arquivo" disabled>
                        Arquivo
                    </TabsTrigger>
                    <TabsTrigger value="Arquivo" disabled>
                        Entrega de laudo
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Imagens" className="space-y-4">
                    <Imagens />
                </TabsContent>
                <TabsContent value="Macroscopia" className="space-y-4">
                    <Macroscopia />
                </TabsContent>



            </Tabs>
        </div>
    )
}