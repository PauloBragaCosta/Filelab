import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let { datalog, PacienteID, MedicoNameID } = req.body;

  let { amostraType, storageQuantity, clinicalSuspicion, observation, DateTimeColeta, examType } = datalog



  const pacientIdNumber = Number(PacienteID);
  // const medicoIdNumber = String(Idmedicobody);

  const exameCriado = await prisma.originExam.create({
    data: {
      storageValue: amostraType,
      storageQuantity: storageQuantity,
      clinicalSuspicion: clinicalSuspicion,
      observation: observation,
      DateTimeColeta: DateTimeColeta,
      exameTipo: examType,
      IdPaciente: pacientIdNumber,
      medicoId: MedicoNameID,
      urgent: true,
    }
  });


  return res.status(201).json({ idExame: exameCriado.idExame });
}
