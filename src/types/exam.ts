export interface Exam {
  nome: any;
  id: string;
  urgency: boolean;
  examDate: string; // ISO date string
  examType: string;
  description: string | null;
  result: string | null;
  fileUrls: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  patientId: string;
  doctorId: string;
  criadoPor: string;
  clinicId: string | null;
  // Related entities
  patient: {
    id: string;
    name: string;
    tutor: {
      id: string;
      nameTutor: string;
    };
  };
  doctor: {
    nameMedico: string;
    id: string;
    name: string;
  };
}

export type ExamType = 'hemograma' | 'bioquimico' | 'anatomia' | 'citologia';
export type SearchableFields = 'id' | 'examType' | 'patient.name' | 'patient.tutor.nameTutor' | 'doctor.name' | 'criadoPor'