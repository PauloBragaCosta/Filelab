import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const items = await prisma.item.findMany({
                orderBy: { createdAt: 'desc' }, // Ordena pelos mais recentes
            });

            return res.status(200).json({ items });
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
