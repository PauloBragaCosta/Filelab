// pages/api/user/uidfind.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Certifique-se de que o Prisma Client esteja corretamente configurado

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' }); // Retorna 405 para métodos que não sejam POST
  }

  const { uid } = req.body;

  // Verifica se o UID foi enviado
  if (!uid) {
    return res.status(400).json({ error: 'UID é obrigatório' });
  }

  try {
    // Busca o usuário no banco de dados pelo UID
    const user = await prisma.user.findUnique({
      where: { uid },
    });

    // Se o usuário não for encontrado
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Retorna os dados do usuário
    return res.status(200).json({
      name: user.name,
      photoURL: user.photoURL,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário no Prisma:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
}
