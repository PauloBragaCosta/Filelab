import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RegisterLog } from '@/components/compopages/registerLog';

// Defina a interface para os logs
interface LogItem {
  id: string;
  UserCreated: string;
  status: string;
  observation: string;
  createdAt: string; // Supondo que haja um campo createdAt
}

export default function ItemStatusLogsTable({ logs }: { logs: LogItem[] }) {
  return (
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
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.UserCreated}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.observation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
