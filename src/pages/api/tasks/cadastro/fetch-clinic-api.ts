
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
    const clinic = await prisma.clinic.findMany({
      select: {
        id: true,
        nameClinic: true,
      }
    })

    res.status(200).json(clinic.map(clinic => ({ id: clinic.id, label: clinic.nameClinic })))
  } catch (error) {
    console.error('Error fetching clinica:', error)
    res.status(500).json({ message: 'Error fetching clinica', error })
  }
}
