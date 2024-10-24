// pages/api/doctors/create.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const doctor = await prisma.doctor.create({
      data: req.body,
    })

    res.status(201).json(doctor)
  } catch (error) {
    console.error('Error creating doctor:', error)
    res.status(500).json({ message: 'Error creating doctor', error })
  }
}
