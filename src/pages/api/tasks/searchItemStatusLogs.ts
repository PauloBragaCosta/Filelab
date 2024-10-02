import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemStatusLog = {
  id: number;
  userCreated: string;
  observation: string;
  status: string;
  createdAt: string;
  itemType: string;
};

type Data = ItemStatusLog[] | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { itemCode, itemType } = req.body;

  if (!itemCode || typeof itemCode !== 'string' || !itemType || typeof itemType !== 'string') {
    return res.status(400).json({ error: 'Item code and item type are required' });
  }

  try {
    let itemStatusLogs;

    if (itemType === 'bloco') {
      itemStatusLogs = await prisma.itemStatusLog.findMany({
        where: {
          itemType: 'bloco',
          blockId: itemCode
        },
        include: {
          block: true
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (itemType === 'lamina') {
      itemStatusLogs = await prisma.itemStatusLog.findMany({
        where: {
          itemType: 'lamina',
          slideId: itemCode
        },
        include: {
          slide: true
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      return res.status(400).json({ error: 'Invalid item type' });
    }

    const responseLogs: ItemStatusLog[] = itemStatusLogs.map((log) => ({
      id: log.id,
      userCreated: log.userCreated,
      observation: log.observation,
      status: log.status,
      createdAt: log.createdAt.toISOString(),
      itemType: log.itemType
    }));

    console.log(responseLogs);

    res.status(200).json(responseLogs);
  } catch (error) {
    console.error('Error fetching item status logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}