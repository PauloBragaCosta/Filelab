
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let { nomeCompleto, especieValue, sexo, dataNascimento, raca, tutorId} = req.body;

    // Convertendo a string 'dataNascimento' em um objeto Date
    // dataNascimento = new Date(dataNascimento);

    const pacienteCriado = await prisma.paciente.create({
        data: {
            nomeCompleto: nomeCompleto,
            especieValue: especieValue,
            sexoValue: sexo,
            dataNascimento,
            racaValue: raca,
            tutorId,
        }
    });

    return res.status(201).json({ IdPaciente: pacienteCriado.PacientId });
}
