import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { uid, name, photoURL } = req.body;

        try {
            // Salva o usuário no banco de dados
            const newUser = await prisma.user.create({
                data: {
                    uid,
                    name,
                    photoURL,
                },
            });

            res.status(200).json({ message: 'Usuário criado com sucesso!', user: newUser });
        } catch (error) {
            console.error('Erro ao salvar o usuário:', error);
            res.status(500).json({ message: 'Erro ao salvar o usuário.' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido.' });
    }
}
