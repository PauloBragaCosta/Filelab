-- CreateTable
CREATE TABLE "examType" (
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "examType_pkey" PRIMARY KEY ("value")
);

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_exameTipo_fkey" FOREIGN KEY ("exameTipo") REFERENCES "examType"("value") ON DELETE SET NULL ON UPDATE CASCADE;
