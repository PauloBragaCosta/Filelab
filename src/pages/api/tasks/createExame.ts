import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let { data, pacientId, Idmedicobody } = req.body;

  let { amostraType, storageQuantity, clinicalSuspicion, observation, DateTimeColeta, examType } = data



  const pacientIdNumber = Number(pacientId);
  // const medicoIdNumber = String(Idmedicobody);

  console.log(pacientIdNumber)
  console.log(Idmedicobody)




  const exameCriado = await prisma.originExam.create({
    data: {
      storageValue: amostraType,
      storageQuantity: storageQuantity,
      clinicalSuspicion: clinicalSuspicion,
      observation: observation,
      DateTimeColeta: DateTimeColeta,
      exameTipo: examType,
      IdPaciente: pacientIdNumber,
      medicoId: Idmedicobody,
    }



  });

  return res.status(201).json({ idExame: exameCriado.idExame });
}
