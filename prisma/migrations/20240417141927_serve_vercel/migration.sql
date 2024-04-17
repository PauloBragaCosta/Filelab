/*
  Warnings:

  - Added the required column `urgent` to the `OriginExam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OriginExam" ADD COLUMN     "urgent" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "base64Image" TEXT NOT NULL,
    "examId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_examId_fkey" FOREIGN KEY ("examId") REFERENCES "OriginExam"("idExame") ON DELETE RESTRICT ON UPDATE CASCADE;
