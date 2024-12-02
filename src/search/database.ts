import { Exam } from "@/types/exam";

export const simulatedDatabase: Exam[] = [
  {
    id: 100007,
    urgency: true,
    examDate: "2024-10-26T03:00:00.000Z",
    examType: "Hemograma",
    description: "",
    result: null,
    fileUrls: [],
    createdAt: "2024-10-26T13:56:22.730Z",
    updatedAt: "2024-10-26T13:56:22.730Z",
    patientId: "503409c9-3076-4684-8f04-cd2c80f1012e",
    doctorId: "74d6723f-0662-42c7-a89c-858da20c9d3f",
    criadoPor: "SISTEMA",
    clinicId: "6df10d35-407b-4fae-a832-8a376fe356f2",
    patient: {
      id: "503409c9-3076-4684-8f04-cd2c80f1012e",
      name: "teste 20",
      especie: "gato",
      raca: "hg",
      idade: 5,
      sexo: "macho",
      peso: 14,
      createdAt: "2024-10-09T16:05:17.704Z",
      updatedAt: "2024-10-09T16:05:17.704Z",
      tutorId: "15b0d610-8733-4709-ae29-ecdade81743a",
      tutor: {
        id: "15b0d610-8733-4709-ae29-ecdade81743a",
        nameTutor: "João Silva"
      }
    },
    doctor: {
      id: "74d6723f-0662-42c7-a89c-858da20c9d3f",
      nameMedico: "gab",
      telephoneMedico: "770000000",
      emailMedico: "test@example.com",
      crmv: "435345",
      comunicacaoEmailsMedico: true,
      marketingEmailsMedico: false,
      comunicacaoWhatsappMedico: false,
      createdAt: "2024-10-09T15:20:06.575Z",
      updatedAt: "2024-10-09T15:20:06.575Z"
    },
    Clinic: {
      id: "6df10d35-407b-4fae-a832-8a376fe356f2",
      nameClinic: "Lacpat",
      telephoneClinic: null,
      emailClinic: null,
      Endereco: null,
      CEP: "",
      createdAt: "2024-10-24T22:30:06.792Z",
      updatedAt: "2024-10-24T22:30:06.792Z"
    }
  },
  {
    id: 100008,
    urgency: true,
    examDate: "2024-10-26T03:00:00.000Z",
    examType: "Hemograma,Ureia,Creatinina,ALT,AST,GGT,FA,Proteína,Biópsia",
    description: "",
    result: null,
    fileUrls: [
      "https://firebasestorage.googleapis.com/v0/b/file-lab.appspot.com/o/registros%2F1729955829166-Imagem%20do%20WhatsApp%20de%202024-10-05%20%C3%A0(s)%2011.19.02_ada9016b.jpg?alt=media&token=c8ef8361-a684-4440-93b2-63cc089984fd"
    ],
    createdAt: "2024-10-26T15:17:20.352Z",
    updatedAt: "2024-10-26T15:17:20.352Z",
    patientId: "503409c9-3076-4684-8f04-cd2c80f1012e",
    doctorId: "74d6723f-0662-42c7-a89c-858da20c9d3f",
    criadoPor: "SISTEMA",
    clinicId: "6df10d35-407b-4fae-a832-8a376fe356f2",
    patient: {
      id: "503409c9-3076-4684-8f04-cd2c80f1012e",
      name: "teste 20",
      especie: "gato",
      raca: "hg",
      idade: 5,
      sexo: "macho",
      peso: 14,
      createdAt: "2024-10-09T16:05:17.704Z",
      updatedAt: "2024-10-09T16:05:17.704Z",
      tutorId: "15b0d610-8733-4709-ae29-ecdade81743a",
      tutor: {
        id: "15b0d610-8733-4709-ae29-ecdade81743a",
        nameTutor: "Maria Santos"
      }
    },
    doctor: {
      id: "74d6723f-0662-42c7-a89c-858da20c9d3f",
      nameMedico: "gab",
      telephoneMedico: "770000000",
      emailMedico: "test@example.com",
      crmv: "435345",
      comunicacaoEmailsMedico: true,
      marketingEmailsMedico: false,
      comunicacaoWhatsappMedico: false,
      createdAt: "2024-10-09T15:20:06.575Z",
      updatedAt: "2024-10-09T15:20:06.575Z"
    },
    Clinic: {
      id: "6df10d35-407b-4fae-a832-8a376fe356f2",
      nameClinic: "Lacpat",
      telephoneClinic: null,
      emailClinic: null,
      Endereco: null,
      CEP: "",
      createdAt: "2024-10-24T22:30:06.792Z",
      updatedAt: "2024-10-24T22:30:06.792Z"
    }
  },
  {
    id: 100006,
    urgency: false,
    examDate: "2024-10-26T03:00:00.000Z",
    examType: "Hemograma",
    description: "",
    result: null,
    fileUrls: [],
    createdAt: "2024-10-26T13:45:47.256Z",
    updatedAt: "2024-10-26T13:45:47.256Z",
    patientId: "503409c9-3076-4684-8f04-cd2c80f1012e",
    doctorId: "74d6723f-0662-42c7-a89c-858da20c9d3f",
    criadoPor: "SISTEMA",
    clinicId: "6df10d35-407b-4fae-a832-8a376fe356f2",
    patient: {
      id: "503409c9-3076-4684-8f04-cd2c80f1012e",
      name: "teste 20",
      especie: "gato",
      raca: "hg",
      idade: 5,
      sexo: "macho",
      peso: 14,
      createdAt: "2024-10-09T16:05:17.704Z",
      updatedAt: "2024-10-09T16:05:17.704Z",
      tutorId: "15b0d610-8733-4709-ae29-ecdade81743a",
      tutor: {
        id: "15b0d610-8733-4709-ae29-ecdade81743a",
        nameTutor: "Pedro Oliveira"
      }
    },
    doctor: {
      id: "74d6723f-0662-42c7-a89c-858da20c9d3f",
      nameMedico: "gab",
      telephoneMedico: "770000000",
      emailMedico: "test@example.com",
      crmv: "435345",
      comunicacaoEmailsMedico: true,
      marketingEmailsMedico: false,
      comunicacaoWhatsappMedico: false,
      createdAt: "2024-10-09T15:20:06.575Z",
      updatedAt: "2024-10-09T15:20:06.575Z"
    },
    Clinic: {
      id: "6df10d35-407b-4fae-a832-8a376fe356f2",
      nameClinic: "Lacpat",
      telephoneClinic: null,
      emailClinic: null,
      Endereco: null,
      CEP: "",
      createdAt: "2024-10-24T22:30:06.792Z",
      updatedAt: "2024-10-24T22:30:06.792Z"
    }
  }
];