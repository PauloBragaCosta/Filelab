
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        nameMedico: true,
      }
    })

    res.status(200).json(doctors.map(doctor => ({ id: doctor.id, label: doctor.nameMedico })))
  } catch (error) {
    console.error('Error fetching doctors:', error)
    res.status(500).json({ message: 'Error fetching doctors', error })
  }
}
