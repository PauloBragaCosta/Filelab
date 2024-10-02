import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Buscar todos os blocos e slides sem logs
    const blocksWithoutLogs = await prisma.block.findMany({
      where: {
        statusLogs: {
          none: {}
        }
      }
    });

    const slidesWithoutLogs = await prisma.slide.findMany({
      where: {
        statusLogs: {
          none: {}
        }
      }
    });

    let addedLogs = 0;

    // Adicionar logs para blocos
    for (const block of blocksWithoutLogs) {
      await prisma.itemStatusLog.create({
        data: {
          userCreated: 'Sistema',
          observation: 'Cadastro feito para arquivamento',
          status: block.status,
          itemType: 'bloco',
          blockId: block.itemCode,
          createdAt: block.createdAt
        }
      });
      addedLogs++;
    }

    // Adicionar logs para slides
    for (const slide of slidesWithoutLogs) {
      await prisma.itemStatusLog.create({
        data: {
          userCreated: 'Sistema',
          observation: 'Log inicial adicionado automaticamente',
          status: slide.status,
          itemType: 'lamina',
          slideId: slide.itemCode,
          createdAt: slide.createdAt
        }
      });
      addedLogs++;
    }

    res.status(200).json({ message: 'Logs adicionados com sucesso', addedLogs });
  } catch (error) {
    console.error('Erro ao adicionar logs:', error);
    res.status(500).json({ message: 'Erro ao adicionar logs' });
  }
}
