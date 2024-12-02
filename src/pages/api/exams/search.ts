import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const exams = await prisma.exam.findMany({
      include: {
        patient: {
          include: {
            tutor: true
          }
        },
        doctor: true,
        Clinic: true,
      }
    });

    res.status(200).json(exams)
  } catch (error) {
    console.error("Erro na busca de exames:", error);
    res.status(500).json({ message: 'Error fetching exams' })
  } finally {
    await prisma.$disconnect()
  }
}

