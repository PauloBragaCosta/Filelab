// pages/api/backup/download.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Exemplo de tabelas
      const items = await prisma.item.findMany();
      const itemStatusLog = await prisma.itemStatusLog.findMany();
      const users = await prisma.user.findMany();

      // Gera um arquivo JSON com os dados
      const backupData = {
        items,
        itemStatusLog,
        users,
      };

      // Define o cabeçalho para download
      res.setHeader('Content-Disposition', 'attachment; filename=backup.json');
      res.status(200).json(backupData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar o backup' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
