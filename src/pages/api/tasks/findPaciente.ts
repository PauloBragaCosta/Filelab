import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {

    const posts = await prisma.paciente.findMany();
    

    res.json(posts)
}