import { Exam, SearchableFields } from '@/types/exam'

function searchById(exam: Exam, searchTerm: string): boolean {
  const examId = exam.id.toString()
  const searchValue = searchTerm.trim()
  
  // Handle exact match
  if (examId === searchValue) {
    return true
  }
  
  // Handle partial match
  return examId.includes(searchValue)
}

function filterExams(exams: Exam[], filterValue: SearchableFields, searchTerm: string): Exam[] {
  const normalizedSearchTerm = searchTerm.toLowerCase()

  return exams.filter(exam => {
    switch (filterValue) {
      case 'id':
        return searchById(exam, searchTerm)
      
      case 'examType':
        return exam.examType.toLowerCase().includes(normalizedSearchTerm)
      
      case 'patient.name':
        return exam.patient.name?.toLowerCase().includes(normalizedSearchTerm) ?? false
      
      case 'patient.tutor.nameTutor':
        return exam.patient.tutor.nameTutor?.toLowerCase().includes(normalizedSearchTerm) ?? false
      
      case 'doctor.name':
        return exam.doctor.nameMedico?.toLowerCase().includes(normalizedSearchTerm) ?? false
      
      case 'criadoPor':
        return exam.criadoPor.toLowerCase().includes(normalizedSearchTerm)
      
      default:
        return true // If no filter is applied, include all exams
    }
  }).slice(0, 10) // Limit results to 10 items
}

let cachedExams: Exam[] = []

export async function searchExams(filterValue: SearchableFields, searchTerm: string): Promise<Exam[]> {
  try {
    if (cachedExams.length === 0) {
      const response = await fetch('/api/exams/search', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch exams')
      }

      cachedExams = await response.json()
    }

    return filterExams(cachedExams, filterValue, searchTerm)
  } catch (error) {
    console.error('Error searching exams:', error)
    throw new Error('Failed to search exams')
  }
}

