// pages/api/sse.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const checkForChanges = async () => {
    const blocks = await prisma.block.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const slides = await prisma.slide.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const items = [...blocks, ...slides];
    sendEvent({ items });
  };

  // Verifica mudanças a cada 5 segundos
  const interval = setInterval(checkForChanges, 5000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });

  // Envia dados iniciais
  await checkForChanges();
}
