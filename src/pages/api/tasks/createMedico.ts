
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let { nameMedico, telephoneMedico, emailMedico,crmv, comunicacaoEmailsMedico, marketingEmailsMedico, comunicacaoWhatsappMedico} = req.body;

   

    const medico = await prisma.medico.create({
        data: {
            nameMedico,
            telephoneMedico,
            emailMedico,
            crmv,
            comunicacaoEmailsMedico,
            marketingEmailsMedico,
            comunicacaoWhatsappMedico,
        }
    });

    return res.status(201).json({idMedico: medico.idMedico});
}
