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
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        name: true,
      }
    })

    res.status(200).json(patients.map(patient => ({ id: patient.id, label: patient.name })))
  } catch (error) {
    console.error('Error fetching patients:', error)
    res.status(500).json({ message: 'Error fetching patients', error })
  }
}