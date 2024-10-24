import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const backupData = req.body;

      // Limpa todas as tabelas na ordem correta para evitar problemas de chave estrangeira
      await prisma.itemStatusLog.deleteMany();
      await prisma.hemograma.deleteMany();
      await prisma.bioquimico.deleteMany();
      await prisma.anatomiaPatologica.deleteMany();
      await prisma.citologia.deleteMany();
      await prisma.exam.deleteMany();
      await prisma.patient.deleteMany();
      await prisma.tutor.deleteMany();
      await prisma.doctor.deleteMany();
      await prisma.clinic.deleteMany();
      await prisma.slide.deleteMany();
      await prisma.block.deleteMany();
      await prisma.user.deleteMany();

      // Restaura os dados na ordem correta
      await prisma.user.createMany({
        data: backupData.users,
      });

      await prisma.doctor.createMany({
        data: backupData.doctors,
      });

      await prisma.clinic.createMany({
        data: backupData.clinics,
      });

      await prisma.tutor.createMany({
        data: backupData.tutors,
      });

      await prisma.patient.createMany({
        data: backupData.patients,
      });

      await prisma.exam.createMany({
        data: backupData.exams.map((exam: any) => ({
          ...exam,
          examDate: new Date(exam.examDate),
          createdAt: new Date(exam.createdAt),
          updatedAt: new Date(exam.updatedAt),
        })),
      });

      await prisma.hemograma.createMany({
        data: backupData.hemogramas,
      });

      await prisma.bioquimico.createMany({
        data: backupData.bioquimicos,
      });

      await prisma.anatomiaPatologica.createMany({
        data: backupData.anatomiasPatologicas,
      });

      await prisma.citologia.createMany({
        data: backupData.citologias,
      });

      await prisma.block.createMany({
        data: backupData.blocks.map((block: any) => ({
          ...block,
          createdAt: new Date(block.createdAt),
        })),
      });

      await prisma.slide.createMany({
        data: backupData.slides.map((slide: any) => ({
          ...slide,
          createdAt: new Date(slide.createdAt),
        })),
      });

      await prisma.itemStatusLog.createMany({
        data: backupData.itemStatusLogs.map((log: any) => ({
          ...log,
          createdAt: new Date(log.createdAt),
        })),
      });

      res.status(200).json({ message: 'Backup restaurado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao restaurar o backup' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}