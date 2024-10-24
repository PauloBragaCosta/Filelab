-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "nameMedico" TEXT,
    "telephoneMedico" TEXT,
    "emailMedico" TEXT,
    "crmv" TEXT,
    "comunicacaoEmailsMedico" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmailsMedico" BOOLEAN NOT NULL DEFAULT false,
    "comunicacaoWhatsappMedico" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "nameTutor" TEXT,
    "especie" TEXT,
    "raca" TEXT,
    "idade" INTEGER,
    "sexo" TEXT,
    "peso" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tutorId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL,
    "nameTutor" TEXT,
    "telephoneTutor" TEXT,
    "emailTutor" TEXT,
    "communicationEmailsTutor" BOOLEAN NOT NULL DEFAULT false,
    "socialWhatsappTutor" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmailsTutor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "examType" TEXT,
    "description" TEXT,
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_emailMedico_key" ON "Doctor"("emailMedico");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_emailTutor_key" ON "Tutor"("emailTutor");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
