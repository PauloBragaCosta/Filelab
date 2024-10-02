import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { itemCode, userCreated, observation, status, itemType } = req.body;

    if (!['bloco', 'lamina'].includes(itemType)) {
      return res.status(400).json({ message: 'Invalid itemType. Must be "bloco" or "lamina".' });
    }

    // Iniciar uma transação para garantir que ambas as operações sejam bem-sucedidas
    const result = await prisma.$transaction(async (prisma) => {
      // Criar o log
      const log = await prisma.itemStatusLog.create({
        data: {
          userCreated,
          observation,
          status,
          itemType,
          ...(itemType === 'bloco'
            ? { block: { connect: { itemCode } } }
            : { slide: { connect: { itemCode } } }),
        },
      });

      // Atualizar o status do Block ou Slide
      if (itemType === 'bloco') {
        await prisma.block.update({
          where: { itemCode },
          data: { status },
        });
      } else {
        await prisma.slide.update({
          where: { itemCode },
          data: { status },
        });
      }

      return { log, updatedItemType: itemType };
    });

    res.status(200).json({
      message: 'Log created and item status updated successfully',
      log: result.log,
      updatedItemType: result.updatedItemType
    });
  } catch (error) {
    console.error('Error creating log and updating item status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}