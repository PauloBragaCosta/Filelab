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
          createdAt: new Date(item.createdAt),
        })),
      });

      // Restaura os logs de status de itens, usando a chave correta do JSON
      await prisma.itemStatusLog.createMany({
        data: backupData.itemStatusLog.map((log: any) => ({
          itemCode: log.itemCode,
          UserCreated: log.UserCreated,
          observation: log.observation,
          status: log.status,
          createdAt: new Date(log.createdAt),
        })),
      });

      res.status(200).json({ message: 'Backup restaurado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao restaurar o backup.' });
    } finally {
      await prisma.$disconnect(); // Fechar conexão com Prisma
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
