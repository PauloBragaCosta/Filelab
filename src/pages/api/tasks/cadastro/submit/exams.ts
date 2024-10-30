import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Acessa o corpo da requisição diretamente, sem os parênteses
  const data = req.body;
  console.log(data)

  try {
    const exam = await prisma.exam.create({
      data: {
        urgency: data.urgency,
        examDate: data.examDate,
        examType: data.examType,
        description: data.description,
        patientId: data.patientId,
        doctorId: data.doctorId,
        clinicId: data.clinicId,
        fileUrls: data.fileUrls,
        criadoPor: data.criadoPor || "SISTEMA",
        ...(data.hemogramaId && {
          hemograma: {
            connect: {
              id: data.hemogramaId
            }
          }
        }),
        ...(data.bioquimicoId && {
          bioquimico: {
            connect: {
              id: data.bioquimicoId
            }
          }
        }),
        ...(data.anatomiaPatologicaId && {
          anatomia: {
            connect: {
              id: data.anatomiaPatologicaId
            }
          }
        }),
        ...(data.citologiaId && {
          citologia: {
            connect: {
              id: data.citologiaId
            }
          }
        }),
      },
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Error creating exam', error });
  }
}
