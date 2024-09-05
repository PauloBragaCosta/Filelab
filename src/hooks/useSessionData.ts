import { useState, useCallback } from 'react'

export function useSessionData() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSessionData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setSession(data)
    } catch (error) {
      console.error('Failed to fetch session data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { session, loading, fetchSessionData }
}