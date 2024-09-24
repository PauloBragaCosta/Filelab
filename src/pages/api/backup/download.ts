// pages/api/backup/download.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Busca os dados das tabelas
      const blocks = await prisma.block.findMany(); // Busca os blocos
      const slides = await prisma.slide.findMany(); // Busca as lâminas
      const itemStatusLog = await prisma.itemStatusLog.findMany();
      const users = await prisma.user.findMany();

      // Gera um arquivo JSON com os dados
      const backupData = {
        blocks, // Incluindo dados de blocos
        slides, // Incluindo dados de lâminas
        itemStatusLog,
        users,
      };

      // Define o cabeçalho para download
      res.setHeader('Content-Disposition', 'attachment; filename=backup.json');
      res.setHeader('Content-Type', 'application/json'); // Define o tipo de conteúdo como JSON
      res.status(200).json(backupData);
    } catch (error) {
      console.error(error); // Log do erro para depuração
      res.status(500).json({ error: 'Erro ao gerar o backup' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
