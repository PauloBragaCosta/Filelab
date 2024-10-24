/*
  Warnings:

  - The `examId` column on the `AnatomiaPatologica` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `examId` column on the `Bioquimico` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `examId` column on the `Citologia` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `examId` column on the `Hemograma` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "AnatomiaPatologica" DROP CONSTRAINT "AnatomiaPatologica_examId_fkey";

-- DropForeignKey
ALTER TABLE "Bioquimico" DROP CONSTRAINT "Bioquimico_examId_fkey";

-- DropForeignKey
ALTER TABLE "Citologia" DROP CONSTRAINT "Citologia_examId_fkey";

-- DropForeignKey
ALTER TABLE "Hemograma" DROP CONSTRAINT "Hemograma_examId_fkey";

-- AlterTable
ALTER TABLE "AnatomiaPatologica" DROP COLUMN "examId",
ADD COLUMN     "examId" INTEGER;

-- AlterTable
ALTER TABLE "Bioquimico" DROP COLUMN "examId",
ADD COLUMN     "examId" INTEGER;

-- AlterTable
ALTER TABLE "Citologia" DROP COLUMN "examId",
ADD COLUMN     "examId" INTEGER;

-- AlterTable
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Exam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Hemograma" DROP COLUMN "examId",
ADD COLUMN     "examId" INTEGER;

-- Alterar a sequência do campo `id` da tabela `Exam`
ALTER SEQUENCE "Exam_id_seq" RESTART WITH 100001;

-- CreateIndex
CREATE UNIQUE INDEX "AnatomiaPatologica_examId_key" ON "AnatomiaPatologica"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "Bioquimico_examId_key" ON "Bioquimico"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "Citologia_examId_key" ON "Citologia"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "Hemograma_examId_key" ON "Hemograma"("examId");

-- AddForeignKey
ALTER TABLE "Hemograma" ADD CONSTRAINT "Hemograma_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bioquimico" ADD CONSTRAINT "Bioquimico_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnatomiaPatologica" ADD CONSTRAINT "AnatomiaPatologica_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citologia" ADD CONSTRAINT "Citologia_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
