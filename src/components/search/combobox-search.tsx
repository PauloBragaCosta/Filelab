"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { FilterSelector } from "./filter-selector"
import { SearchResults } from "./search-results"
import { filters } from "@/search/filters"
import { Exam } from "@/types/exam"
import { useSearchExams } from "@/hooks/search/use-search-exams"

export function ComboboxSearch() {
  const router = useRouter()
  const [filterValue, setFilterValue] = React.useState<string>(filters[0].value)
  const [searchTerm, setSearchTerm] = React.useState("")
  const { searchResults, handleSearch } = useSearchExams(filterValue)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)


  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    setSelectedIndex(-1)
    handleSearch(value)
  }

  const handleFilterChange = (value: string) => {
    const newFilter = value || filters[0].value
    setFilterValue(newFilter)
    handleSearch(searchTerm)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0)
        break
      case 'Enter':
        e.preventDefault()
        const selectedItem = searchResults[selectedIndex] || searchResults[0]
        if (selectedItem) {
          handleSelect(selectedItem)
        }
        break
    }
  }


  const getFilterField = (filter: string) => {
    switch (filter) {
      case 'id':
        return 'id';
      case 'patientName':
        return 'patient.name';
      case 'tutorName':
        return 'patient.tutor.nameTutor';
      default:
        return 'all';
    }
  };

  const [exams, setExams] = React.useState<Exam[]>([]);
  const handleSelect = (exam: Exam) => {
    router.push(`/exam/${exam.id}`)
  }

  return (
    <div className="flex flex-col w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar exames..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20"
        />
        <FilterSelector
          filters={filters}
          selectedFilter={filterValue}
          onFilterChange={handleFilterChange}
        />
        <SearchResults 
          results={searchResults} 
          filterValue={filterValue}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}

