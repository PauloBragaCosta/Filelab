-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "raca" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tutorId" TEXT,
    "medicoId" TEXT,
    "exameId" INTEGER,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "idTutor" TEXT NOT NULL,
    "nameTutor" TEXT NOT NULL,
    "telephoneTutor" TEXT NOT NULL,
    "emailTutor" TEXT NOT NULL,
    "communicationEmailsTutor" BOOLEAN NOT NULL,
    "marketingEmailsTutor" BOOLEAN NOT NULL,
    "socialWhatsappTutor" BOOLEAN NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("idTutor")
);

-- CreateTable
CREATE TABLE "Medico" (
    "idMedico" TEXT NOT NULL,
    "nameMedico" TEXT NOT NULL,
    "telephoneMedico" TEXT NOT NULL,
    "emailMedico" TEXT NOT NULL,
    "crmv" TEXT NOT NULL,
    "comunicacaoEmailsMedico" BOOLEAN NOT NULL,
    "marketingEmailsMedico" BOOLEAN NOT NULL,
    "comunicacaoWhatsappMedico" BOOLEAN NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("idMedico")
);

-- CreateTable
CREATE TABLE "Exame" (
    "idExame" SERIAL NOT NULL,
    "amostra" TEXT NOT NULL,
    "amostraType" INTEGER NOT NULL,
    "clinicalSuspicion" TEXT NOT NULL,
    "observation" TEXT,
    "DateTimeColeta" TIMESTAMP(3) NOT NULL,
    "exameTipo" TEXT NOT NULL,

    CONSTRAINT "Exame_pkey" PRIMARY KEY ("idExame")
);

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("idTutor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("idMedico") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_exameId_fkey" FOREIGN KEY ("exameId") REFERENCES "Exame"("idExame") ON DELETE SET NULL ON UPDATE CASCADE;
