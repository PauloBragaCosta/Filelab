/*
  Warnings:

  - Added the required column `criadoPor` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urgency` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Made the column `examType` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "criadoPor" TEXT NOT NULL,
ADD COLUMN     "urgency" BOOLEAN NOT NULL,
ALTER COLUMN "examType" SET NOT NULL;

-- CreateTable
CREATE TABLE "Hemograma" (
    "id" TEXT NOT NULL,
    "hemacias" DOUBLE PRECISION,
    "plaquetas" DOUBLE PRECISION,
    "rdw" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "Hemograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bioquimico" (
    "id" TEXT NOT NULL,
    "ureia" DOUBLE PRECISION,
    "creatinina" DOUBLE PRECISION,
    "alt" DOUBLE PRECISION,
    "ast" DOUBLE PRECISION,
    "ggt" DOUBLE PRECISION,
    "fa" DOUBLE PRECISION,
    "proteina" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "Bioquimico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnatomiaPatologica" (
    "id" TEXT NOT NULL,
    "biopsia" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "AnatomiaPatologica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citologia" (
    "id" TEXT NOT NULL,
    "citologiaOuvido" BOOLEAN,
    "citologiaPele" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "Citologia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hemograma_examId_key" ON "Hemograma"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "Bioquimico_examId_key" ON "Bioquimico"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "AnatomiaPatologica_examId_key" ON "AnatomiaPatologica"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "Citologia_examId_key" ON "Citologia"("examId");

-- AddForeignKey
ALTER TABLE "Hemograma" ADD CONSTRAINT "Hemograma_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bioquimico" ADD CONSTRAINT "Bioquimico_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnatomiaPatologica" ADD CONSTRAINT "AnatomiaPatologica_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citologia" ADD CONSTRAINT "Citologia_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
