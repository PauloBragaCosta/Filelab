
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let { nameTutor, telephoneTutor, emailTutor, communicationEmailsTutor, marketingEmailsTutor, socialWhatsappTutor} = req.body;




    const tutor = await prisma.tutor.create({
        data: {
            nameTutor,
            telephoneTutor,
            emailTutor,
            communicationEmailsTutor,
            marketingEmailsTutor,
            socialWhatsappTutor,
        }
    });

    return res.status(201).json({idTutor: tutor.idTutor});
}
