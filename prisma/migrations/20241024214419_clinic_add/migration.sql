-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "clinicId" TEXT;

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "nameClinic" TEXT NOT NULL,
    "telephoneClinic" TEXT,
    "emailClinic" TEXT,
    "Endereco" TEXT,
    "CEP" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_emailClinic_key" ON "Clinic"("emailClinic");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
