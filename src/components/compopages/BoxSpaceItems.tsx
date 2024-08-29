import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Defina a interface para os itens
interface BoxSpaceItem {
  itemCode: string;
  examType: string;
  status: string;
}

export function BoxSpaceItems({ boxNumber, spaceNumber, itemType }: { boxNumber: string; spaceNumber: string; itemType: string }) {
  const [boxSpaceItems, setBoxSpaceItems] = useState<BoxSpaceItem[]>([]);

  useEffect(() => {
    async function fetchBoxSpaceItems() {
      try {
        const response = await fetch('/api/tasks/searchByBoxSpaceType', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ boxNumber, spaceNumber, itemType }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items: BoxSpaceItem[] = await response.json();
        setBoxSpaceItems(items);
      } catch (error) {
        console.error('Error fetching items:', error);
        setBoxSpaceItems([]);
      }
    }

    fetchBoxSpaceItems();
  }, [boxNumber, spaceNumber, itemType]);

  return (
    <Card className="flex-1 space-y-4">
      <CardHeader>
        <CardTitle>Itens da mesma coluna</CardTitle>
        <CardDescription>contem {boxSpaceItems.length} registros</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Exame</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boxSpaceItems.map((item) => (
              <TableRow key={item.itemCode}>
                <TableCell>{item.itemCode}</TableCell>
                <TableCell>{item.examType}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
