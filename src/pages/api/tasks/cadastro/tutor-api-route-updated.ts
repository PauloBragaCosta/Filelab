// pages/api/tutors/create.ts
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
    const tutor = await prisma.tutor.create({
      data: req.body,
    })

    res.status(201).json(tutor)
  } catch (error) {
    console.error('Error creating tutor:', error)
    res.status(500).json({ message: 'Error creating tutor', error })
  }
}
