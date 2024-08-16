import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    // Verifica itens existentes para evitar duplicatas
    const existingItems = await prisma.item.findMany({
      where: {
        itemCode: {
          in: items.map((item: any) => item.itemCode),
        },
      },
    });

    if (existingItems.length > 0) {
      // Retorna os itens existentes junto com o erro
      return res.status(409).json({ 
        error: 'Some items already exist', 
        existingItems: existingItems.map(item => ({
          itemCode: item.itemCode,
          itemType: item.itemType,
          boxNumber: item.boxNumber,
          spaceNumber: item.spaceNumber,
          examType: item.examType,
          status: item.status,
        }))
      });
    }

    // Cria novos itens
    const createdItems = await prisma.item.createMany({
      data: items,
      skipDuplicates: true,
    });

    res.status(201).json({ 
      message: 'Items created successfully', 
      count: createdItems.count 
    });

  } catch (error) {
    console.error('Error creating items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
