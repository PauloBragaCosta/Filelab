/*
  Warnings:

  - You are about to drop the column `amostra` on the `Exame` table. All the data in the column will be lost.
  - You are about to drop the column `amostraType` on the `Exame` table. All the data in the column will be lost.
  - The primary key for the `Paciente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `especie` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `exameId` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `medicoId` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `raca` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `Paciente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[IdPaciente]` on the table `Exame` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_exameId_fkey";

-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_medicoId_fkey";

-- AlterTable
ALTER TABLE "Exame" DROP COLUMN "amostra",
DROP COLUMN "amostraType",
ADD COLUMN     "IdPaciente" INTEGER,
ADD COLUMN     "medicoId" TEXT,
ADD COLUMN     "storageQuantity" INTEGER,
ADD COLUMN     "storageValue" TEXT,
ALTER COLUMN "clinicalSuspicion" DROP NOT NULL,
ALTER COLUMN "DateTimeColeta" DROP NOT NULL,
ALTER COLUMN "exameTipo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_pkey",
DROP COLUMN "especie",
DROP COLUMN "exameId",
DROP COLUMN "id",
DROP COLUMN "medicoId",
DROP COLUMN "raca",
DROP COLUMN "sexo",
ADD COLUMN     "PacientId" SERIAL NOT NULL,
ADD COLUMN     "especieValue" TEXT,
ADD COLUMN     "racaValue" TEXT,
ADD COLUMN     "sexoValue" TEXT,
ADD CONSTRAINT "Paciente_pkey" PRIMARY KEY ("PacientId");

-- CreateTable
CREATE TABLE "Especie" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Especie_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "Sexo" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Sexo_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "Raca" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "Raca_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "storage" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "storage_pkey" PRIMARY KEY ("value")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exame_IdPaciente_key" ON "Exame"("IdPaciente");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_racaValue_fkey" FOREIGN KEY ("racaValue") REFERENCES "Raca"("value") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_sexoValue_fkey" FOREIGN KEY ("sexoValue") REFERENCES "Sexo"("value") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_especieValue_fkey" FOREIGN KEY ("especieValue") REFERENCES "Especie"("value") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_IdPaciente_fkey" FOREIGN KEY ("IdPaciente") REFERENCES "Paciente"("PacientId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("idMedico") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_storageValue_fkey" FOREIGN KEY ("storageValue") REFERENCES "storage"("value") ON DELETE SET NULL ON UPDATE CASCADE;
