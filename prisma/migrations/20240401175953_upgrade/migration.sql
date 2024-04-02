/*
  Warnings:

  - You are about to drop the `Exame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `examType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `storage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_IdPaciente_fkey";

-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_exameTipo_fkey";

-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_storageValue_fkey";

-- DropTable
DROP TABLE "Exame";

-- DropTable
DROP TABLE "examType";

-- DropTable
DROP TABLE "storage";

-- CreateTable
CREATE TABLE "Storage" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "ExamType" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "OriginExam" (
    "idExame" SERIAL NOT NULL,
    "storageValue" TEXT,
    "storageQuantity" INTEGER,
    "clinicalSuspicion" TEXT,
    "observation" TEXT,
    "DateTimeColeta" TIMESTAMP(3),
    "exameTipo" TEXT,
    "IdPaciente" INTEGER,
    "medicoId" TEXT,

    CONSTRAINT "OriginExam_pkey" PRIMARY KEY ("idExame")
);

-- AddForeignKey
ALTER TABLE "OriginExam" ADD CONSTRAINT "OriginExam_IdPaciente_fkey" FOREIGN KEY ("IdPaciente") REFERENCES "Paciente"("PacientId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OriginExam" ADD CONSTRAINT "OriginExam_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("idMedico") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OriginExam" ADD CONSTRAINT "OriginExam_storageValue_fkey" FOREIGN KEY ("storageValue") REFERENCES "Storage"("value") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OriginExam" ADD CONSTRAINT "OriginExam_exameTipo_fkey" FOREIGN KEY ("exameTipo") REFERENCES "ExamType"("value") ON DELETE SET NULL ON UPDATE CASCADE;
