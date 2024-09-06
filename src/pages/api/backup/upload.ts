// pages/api/backup/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Aumente o limite de tamanho, se necessário
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const backupData = req.body;

      if (backupData.items && backupData.users && Array.isArray(backupData.items) && Array.isArray(backupData.users)) {
        // Limpa as tabelas existentes
        await prisma.itemStatusLog.deleteMany(); // Deleta os logs antes para evitar problemas de integridade referencial
        await prisma.item.deleteMany();
        await prisma.user.deleteMany();

        // Restaura os dados de usuários
        await prisma.user.createMany({
          data: backupData.users.map((user: any) => ({
            email: user.email,
            password: user.password,
            createdAt: new Date(user.createdAt),
          })),
        });

        // Restaura os dados de itens
        await prisma.item.createMany({
          data: backupData.items.map((item: any) => ({
            itemCode: item.itemCode,
            itemType: item.itemType,
            boxNumber: item.boxNumber,
            spaceNumber: item.spaceNumber,
            examType: item.examType,
            status: item.status,
            createdAt: new Date(item.createdAt), // Converter a string de data para objeto Date
          })),
        });

        // Restaura os logs de status de itens
        if (backupData.itemStatusLogs && Array.isArray(backupData.itemStatusLogs)) {
          await prisma.itemStatusLog.createMany({
            data: backupData.itemStatusLogs.map((log: any) => ({
              itemCode: log.itemCode,
              UserCreated: log.UserCreated,
              observation: log.observation,
              status: log.status,
              createdAt: new Date(log.createdAt),
            })),
          });
        }

        res.status(200).json({ message: 'Backup restaurado com sucesso!' });
      } else {
        res.status(400).json({ error: 'Estrutura de dados de backup inválida.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao restaurar o backup.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}

