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
      await prisma.slide.deleteMany();          // Deleta os slides
      await prisma.block.deleteMany();          // Deleta os blocos
      await prisma.user.deleteMany();           // Deleta os usuários

      // Restaura os dados de usuários
      await prisma.user.createMany({
        data: backupData.users.map((user: any) => ({
          uid: user.uid, // Certifique-se de que 'uid' está no backup
          name: user.name,
          photoURL: user.photoURL,
          role: user.role,
          createdAt: new Date(user.createdAt),
        })),
      });

      // Restaura os dados de blocos
      await prisma.block.createMany({
        data: backupData.blocks.map((block: any) => ({
          itemCode: block.itemCode,
          itemType: block.itemType,
          boxNumber: block.boxNumber,
          spaceNumber: block.spaceNumber,
          examType: block.examType,
          status: block.status,
          createdAt: new Date(block.createdAt),
        })),
      });

      // Restaura os dados de lâminas
      await prisma.slide.createMany({
        data: backupData.slides.map((slide: any) => ({
          itemCode: slide.itemCode,
          itemType: slide.itemType,
          boxNumber: slide.boxNumber,
          spaceNumber: slide.spaceNumber,
          examType: slide.examType,
          status: slide.status,
          createdAt: new Date(slide.createdAt),
        })),
      });

      // Restaura os logs de status de itens, usando a chave correta do JSON
      await prisma.itemStatusLog.createMany({
        data: backupData.itemStatusLog.map((log: any) => ({
          itemCode: log.itemCode,
          userCreated: log.userCreated, // Corrigido para 'userCreated' para seguir o padrão
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
