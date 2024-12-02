import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Item } from '@/types/item';

// Defina a interface para as props do componente
interface BoxSpaceItemsProps {
  boxNumber: string;
  spaceNumber: string;
  itemType: string;
  items: Item[]; // A lista de itens é passada como prop
}

export default function BoxSpaceItems({ boxNumber, spaceNumber, itemType, items }: BoxSpaceItemsProps) {
  // Filtra os itens com base nos critérios de boxNumber, spaceNumber e itemType
  const filteredItems = items.filter(
    (item) => 
      item.boxNumber === boxNumber && 
      item.spaceNumber === spaceNumber 
  );

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Itens da mesma coluna</CardTitle>
        <CardDescription>Contém {filteredItems.length} registros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Exame</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {filteredItems.map((item) => (
                <TableRow key={item.itemCode}>
                  <TableCell>{item.itemCode}</TableCell>
                  <TableCell>{item.examType}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
