
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let { datatag, inputValue, tag } = req.body;

    console.log(req.body);

    if (tag == "raça")
        await prisma.raca.create({
            data: {
                value: inputValue,
                label: datatag,
            }
        });

    if (tag == "especie")
        await prisma.especie.create({
            data: {
                value: inputValue,
                label: datatag,
            }
        });

    if (tag == "tipo de armazenamento")
        await prisma.storage.create({
            data: {
                value: inputValue,
                label: datatag,
            }
        });

    if (tag == "tipo de exame")
        await prisma.examType.create({
            data: {
                value: inputValue,
                label: datatag,
            }
        });


    return res.status(201).json({});
}
