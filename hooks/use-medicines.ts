import { useState, useEffect } from 'react'
import type { Medicine } from '@/lib/types'

export function useMedicines(query: string = '', category: string = '') {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true)
      try {
        const url = new URL('/api/medicines', window.location.origin)
        if (query) url.searchParams.append('q', query)
        if (category) url.searchParams.append('category', category)
        
        const response = await fetch(url.toString())
        if (!response.ok) throw new Error('Failed to fetch medicines')
        const data = await response.json()
        setMedicines(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [query, category])

  return { medicines, setMedicines, loading, error }
}
