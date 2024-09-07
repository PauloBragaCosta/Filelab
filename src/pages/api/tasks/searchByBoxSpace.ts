// src/pages/api/tasks/searchByBoxSpaceType.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { boxNumber, spaceNumber, itemType } = req.body;

    try {
      // Validações básicas
      if (!boxNumber || !spaceNumber || !itemType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Busca itens no banco de dados
      const items = await prisma.item.findMany({
        where: {
          boxNumber,
          spaceNumber,
          itemType,
        },
      });

      // Verifica se encontrou itens
      if (items.length === 0) {
        return res.status(404).json({ message: 'No items found' });
      }

      return res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Apenas método POST é aceito
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
