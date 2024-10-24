import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

    // Acessa o corpo da requisição diretamente, sem os parênteses
    const data = req.body;

  try {
    const anatomiaPatologica = await prisma.anatomiaPatologica.create({
      data: {
        biopsia: data.biopsia,
      },
    });

    res.status(201).json(anatomiaPatologica);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Error creating exam', error });
  }
}    