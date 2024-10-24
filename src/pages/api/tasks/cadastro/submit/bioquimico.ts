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
    const bioquimico = await prisma.bioquimico.create({
      data: {
        ureia: data.ureia,
        creatinina: data.creatinina,
        alt: data.alt,
        ast: data.ast,
        ggt: data.ggt,
        fa: data.fa,
        proteina: data.proteina,
      },
    });

    res.status(201).json(bioquimico);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Error creating exam', error });
  }
}    
