import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemStatusLog = {
  id: string;
  itemCode: string;
  UserCreated: string;
  observation: string;
  status: string;
  createdAt: string; // Aqui, createdAt é do tipo string
};

type Data = ItemStatusLog[] | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { itemCode } = req.query;

  if (!itemCode || typeof itemCode !== 'string') {
    return res.status(400).json({ error: 'Item code is required' });
  }

  try {
    const itemStatusLogs = await prisma.itemStatusLog.findMany({
      where: { itemCode },
    });

    // Mapear todos os campos corretamente e converter `createdAt` para string
    const responseLogs: ItemStatusLog[] = itemStatusLogs.map((log: { id: any; itemCode: any; UserCreated: any; observation: any; status: any; createdAt: { toISOString: () => any; }; }) => ({
      id: log.id,
      itemCode: log.itemCode,
      UserCreated: log.UserCreated,
      observation: log.observation,
      status: log.status,
      createdAt: log.createdAt.toISOString(), // Converte Date para string
    }));

    res.status(200).json(responseLogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
