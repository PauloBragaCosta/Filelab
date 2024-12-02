export interface Filter {
  value: string;
  label: string;
}

// Re-export the Exam type to maintain backwards compatibility
export type { Exam as DatabaseItem } from './exam';