import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    // Busca todos os pacientes e inclui os dados do tutor relacionado
    const pacientes = await prisma.paciente.findMany({
        include: {
            Tutor: true // Certifique-se de que 'Tutor' é o nome correto da relação no modelo
        }
    });

    res.json(pacientes);
}
