
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let { nomeCompleto, especie, sexo, dataNascimento, raca } = req.body;

    // Convertendo a string 'dataNascimento' em um objeto Date
    dataNascimento = new Date(dataNascimento);

    await prisma.paciente.create({
        data: {
            nomeCompleto,
            especie,
            sexo,
            dataNascimento,
            raca
        }
    });

    return res.status(201).json({});
}
