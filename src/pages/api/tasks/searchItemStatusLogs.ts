import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemStatusLog = {
  id: string;
  itemCode: string;
  UserCreated: string;
  observation: string;
  status: string;
  createdAt: string; // `createdAt` agora é uma string no tipo
};

type Data = ItemStatusLog[] | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { itemCode } = req.body;

  if (!itemCode || typeof itemCode !== 'string') {
    return res.status(400).json({ error: 'Item code is required' });
  }

  try {
    const itemStatusLogs = await prisma.itemStatusLog.findMany({
      where: { itemCode },
    });

    const responseLogs: ItemStatusLog[] = itemStatusLogs.map((log) => ({
      id: log.id.toString(), // Converte `id` para string
      itemCode: log.itemCode,
      UserCreated: log.userCreated,
      observation: log.observation,
      status: log.status,
      createdAt: log.createdAt.toISOString(), // Converte Date para string
    }));

    res.status(200).json(responseLogs);
  } catch (error) {
    console.error('Error fetching item status logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
