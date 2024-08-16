import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  itemCode: string;
  itemType: string;
  boxNumber: string;
  spaceNumber: string;
  examType: string;
  createdAt: string;  // Aqui, createdAt é do tipo string
  status: string;
} | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { itemCode } = req.query;

  if (!itemCode || typeof itemCode !== 'string') {
    return res.status(400).json({ error: 'Item code is required' });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { itemCode },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Convertendo o campo createdAt de Date para string
    const responseItem = {
      ...item,
      createdAt: item.createdAt.toISOString(), // Converte Date para string
    };

    res.status(200).json(responseItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
