import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemData = {
  itemCode: string;
  examType: string;
  status: string;
  createdAt: string; // Aqui, createdAt é do tipo string
};

type Data = ItemData[] | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { boxNumber, spaceNumber, itemType } = req.query;

  if (!boxNumber || !spaceNumber || !itemType || 
      typeof boxNumber !== 'string' || 
      typeof spaceNumber !== 'string' || 
      typeof itemType !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  try {
    const items = await prisma.item.findMany({
      where: { 
        boxNumber, 
        spaceNumber, 
        itemType 
      },
    });

    // Mapear todos os campos corretamente e converter `createdAt` para string
    const responseItems: ItemData[] = items.map((item: { itemCode: any; examType: any; status: any; createdAt: { toISOString: () => any; }; }) => ({
      itemCode: item.itemCode,
      examType: item.examType,
      status: item.status,
      createdAt: item.createdAt.toISOString(), // Converte Date para string
    }));

    res.status(200).json(responseItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
