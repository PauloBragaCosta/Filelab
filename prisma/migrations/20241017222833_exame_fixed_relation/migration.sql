-- DropForeignKey
ALTER TABLE "AnatomiaPatologica" DROP CONSTRAINT "AnatomiaPatologica_examId_fkey";

-- DropForeignKey
ALTER TABLE "Bioquimico" DROP CONSTRAINT "Bioquimico_examId_fkey";

-- DropForeignKey
ALTER TABLE "Citologia" DROP CONSTRAINT "Citologia_examId_fkey";

-- DropForeignKey
ALTER TABLE "Hemograma" DROP CONSTRAINT "Hemograma_examId_fkey";

-- AlterTable
ALTER TABLE "AnatomiaPatologica" ALTER COLUMN "examId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bioquimico" ALTER COLUMN "examId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Citologia" ALTER COLUMN "examId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Hemograma" ALTER COLUMN "examId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Hemograma" ADD CONSTRAINT "Hemograma_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bioquimico" ADD CONSTRAINT "Bioquimico_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnatomiaPatologica" ADD CONSTRAINT "AnatomiaPatologica_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citologia" ADD CONSTRAINT "Citologia_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
