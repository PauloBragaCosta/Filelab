import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { pacienteData, tutorData, doctorData, sampleData } = req.body;

    console.log('Paciente:', pacienteData);
    console.log('Tutor:', tutorData);
    console.log('Medico:', doctorData);
    console.log('Exame:', sampleData);

    const { nomeCompleto, especie, sexo, dataNascimento, raca } = pacienteData ? JSON.parse(pacienteData) : null;
    const {nameTutor, telephoneTutor, emailTutor, communicationEmailsTutor, marketingEmailsTutor, socialWhatsappTutor, PacientesTutor } = tutorData ? JSON.parse(tutorData) : null;
    const {nameMedico, telephoneMedico, emailMedico, crmv, comunicacaoEmailsMedico, marketingEmailsMedico, comunicacaoWhatsappMedico } = doctorData ? JSON.parse(doctorData) : null;
    const {amostra, amostraType, clinicalSuspicion, observation, DateTimeColeta, exameTipo} = sampleData ? JSON.parse(sampleData) : null;

    console.log('Paciente:', nomeCompleto);
    console.log('Tutor:', nameTutor);
    console.log('Medico:', doctorData);
    console.log('Exame:', sampleData);

    if (pacienteData && pacienteData.nomeCompleto) {
        await prisma.paciente.create({
            data: {
                nomeCompleto,
                especie,
                sexo,
                dataNascimento,
                raca
            }
        });

        if (tutorData) {
            await prisma.tutor.create({
                data: {
                    nameTutor,
                    telephoneTutor,
                    emailTutor,
                    communicationEmailsTutor,
                    marketingEmailsTutor,
                    socialWhatsappTutor,
                    
                    
                }
            });
        }

        if (doctorData) {
            await prisma.medico.create({
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
        }

        if (sampleData) {
            await prisma.exame.create({
                data: {
                    amostra,
                    amostraType,
                    clinicalSuspicion,
                    observation,
                    DateTimeColeta,
                    exameTipo,
                    
                }
            });
        }
    } else {
        console.log('Dados do paciente inválidos ou campo nomeCompleto ausente');
    }

    return res.status(201).json({});
}
