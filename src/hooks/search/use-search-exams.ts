"use client"

import { useState, useCallback } from "react"
import { Exam, SearchableFields } from "@/types/exam"
import { searchExams } from "@/lib/search"

export function useSearchExams(filterValue: SearchableFields) {
  const [searchResults, setSearchResults] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (searchTerm: string) => {
    const trimmedValue = searchTerm.trim()

    if (trimmedValue === "") {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = searchExams(filterValue, trimmedValue)
      setSearchResults(await results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching exams')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [filterValue])

  return { searchResults, handleSearch, isLoading, error }
}