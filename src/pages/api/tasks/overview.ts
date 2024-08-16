import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const items = await prisma.item.findMany({
                orderBy: { createdAt: 'desc' }, // Ordena pelos mais recentes
            });

            const countbloco = await prisma.item.count({
                where: { itemType: 'bloco' },
            });

            const countlaminas = await prisma.item.count({
                where: { itemType: 'lamina' },
            });

            // Aqui você pode adicionar a lógica para calcular `blocoChange` e `laminasChange`
            const blocoChange = "+10%"; // Substitua por lógica real
            const laminasChange = "+15%"; // Substitua por lógica real

            return res.status(200).json({
                items,
                countbloco,
                countlaminas,
                blocoChange,
                laminasChange,
            });
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error fetching overview data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
