import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Block, Slide } from '@prisma/client';

const prisma = new PrismaClient();

type ItemType = Block | Slide;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, userCreated } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    // Filter items into blocks and slides
    const blocksToCreate = items.filter(item => item.itemType === 'bloco');
    const slidesToCreate = items.filter(item => item.itemType === 'lamina');

    // Check for existing items to avoid duplicates
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
      return res.status(409).json({ 
        error: 'Some items already exist', 
        existingItems: existingItems.map((item: ItemType) => ({
          itemCode: item.itemCode,
          itemType: 'itemType' in item ? item.itemType : ('slideNumber' in item ? 'lamina' : 'bloco'),
          boxNumber: item.boxNumber,
          spaceNumber: item.spaceNumber,
          examType: item.examType,
          status: item.status,
        }))
      });
    }

    // Create new items and their logs
    const createdItems = await prisma.$transaction(async (prisma) => {
      const createdBlocks = await prisma.block.createMany({
        data: blocksToCreate,
        skipDuplicates: true,
      });

      const createdSlides = await prisma.slide.createMany({
        data: slidesToCreate,
        skipDuplicates: true,
      });

      // Create logs for blocks
      await prisma.itemStatusLog.createMany({
        data: blocksToCreate.map(block => ({
          userCreated: userCreated,
          observation: 'Cadastro feito para arquivamento',
          status: block.status,
          itemType: 'bloco',
          blockId: block.itemCode,
          createdAt: new Date(),
        })),
      });

      // Create logs for slides
      await prisma.itemStatusLog.createMany({
        data: slidesToCreate.map(slide => ({
          userCreated: userCreated,
          observation: 'Log inicial adicionado automaticamente',
          status: slide.status,
          itemType: 'lamina',
          slideId: slide.itemCode,
          createdAt: new Date(),
        })),
      });

      return { blocksCount: createdBlocks.count, slidesCount: createdSlides.count };
    });

    res.status(201).json({ 
      message: 'Items created successfully with logs', 
      blocksCount: createdItems.blocksCount, 
      slidesCount: createdItems.slidesCount 
    });

  } catch (error) {
    console.error('Error creating items with logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}