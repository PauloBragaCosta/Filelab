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

    // Filtra os itens em blocos e lâminas
    const blocksToCreate = items.filter(item => item.itemType === 'bloco');
    const slidesToCreate = items.filter(item => item.itemType === 'lamina');

    // Verifica itens existentes para evitar duplicatas
    const existingBlocks = await prisma.block.findMany({
      where: {
        itemCode: {
          in: blocksToCreate.map((item: any) => item.itemCode),
        },
      },
    });

    const existingSlides = await prisma.slide.findMany({
      where: {
        itemCode: {
          in: slidesToCreate.map((item: any) => item.itemCode),
        },
      },
    });

    const existingItems = [...existingBlocks, ...existingSlides];

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
    const createdBlocks = await prisma.block.createMany({
      data: blocksToCreate,
      skipDuplicates: true,
    });

    const createdSlides = await prisma.slide.createMany({
      data: slidesToCreate,
      skipDuplicates: true,
    });

    res.status(201).json({ 
      message: 'Items created successfully', 
      blocksCount: createdBlocks.count, 
      slidesCount: createdSlides.count 
    });

  } catch (error) {
    console.error('Error creating items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
