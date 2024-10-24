import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Busca os dados de todas as tabelas
      const doctors = await prisma.doctor.findMany();
      const patients = await prisma.patient.findMany();
      const tutors = await prisma.tutor.findMany();
      const hemogramas = await prisma.hemograma.findMany();
      const bioquimicos = await prisma.bioquimico.findMany();
      const anatomiasPatologicas = await prisma.anatomiaPatologica.findMany();
      const citologias = await prisma.citologia.findMany();
      const exams = await prisma.exam.findMany();
      const blocks = await prisma.block.findMany();
      const slides = await prisma.slide.findMany();
      const itemStatusLogs = await prisma.itemStatusLog.findMany();
      const users = await prisma.user.findMany();
      const clinics = await prisma.clinic.findMany();


      // Gera um arquivo JSON com todos os dados
      const backupData = {
        doctors,
        patients,
        tutors,
        hemogramas,
        bioquimicos,
        anatomiasPatologicas,
        citologias,
        exams,
        blocks,
        slides,
        itemStatusLogs,
        users,
        clinics,
      };

      // Define o cabeçalho para download
      res.setHeader('Content-Disposition', 'attachment; filename=backup.json');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(backupData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao gerar o backup' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}