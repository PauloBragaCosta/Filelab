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
    const tutors = await prisma.tutor.findMany({
      select: {
        id: true,
        nameTutor: true,
      }
    })

    res.status(200).json(tutors.map(tutor => ({ id: tutor.id, label: tutor.nameTutor })))
  } catch (error) {
    console.error('Error fetching tutors:', error)
    res.status(500).json({ message: 'Error fetching tutors', error })
  }
}