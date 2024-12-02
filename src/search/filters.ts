import { Filter } from "@/types/search";

export const filters: Filter[] = [
  { value: "id", label: "ID" },
  { value: "patient.name", label: "Paciente" },
  { value: "patient.tutor.nameTutor", label: "Tutor" },
];