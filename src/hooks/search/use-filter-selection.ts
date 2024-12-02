"use client"

import { useState, useCallback } from "react"

export function useFilterSelection(onFilterChange: (value: string) => void) {
  const [open, setOpen] = useState(false)

  const handleFilterSelect = useCallback(
    (value: string) => {
      onFilterChange(value)
      setOpen(false)
    },
    [onFilterChange]
  )

  return {
    open,
    setOpen,
    handleFilterSelect,
  }
}