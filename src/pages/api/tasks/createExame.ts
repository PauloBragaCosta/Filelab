
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let { data, IdPacientebody, Idmedicobody } = req.body;

  let { amostra, amostraType, clinicalSuspicion, observation, DateTimeColeta, exameTipo } = data

  let {IdPaciente} = IdPacientebody
  let {medico} = Idmedicobody



  await prisma.exame.create({
    data: {
      amostra,
      amostraType,
      clinicalSuspicion,
      observation,
      DateTimeColeta,
      exameTipo,
      IdPaciente: IdPaciente,
      medicoId: medico,
    }
  });

  return res.status(201).json({});
}
