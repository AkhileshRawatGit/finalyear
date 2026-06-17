import { useState, useEffect } from 'react'
import type { PharmacyStore } from '@/lib/types'

export function usePharmacies() {
  const [pharmacies, setPharmacies] = useState<PharmacyStore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true)
      try {
        const url = new URL('/api/pharmacy', window.location.origin)
        
        const response = await fetch(url.toString())
        if (!response.ok) throw new Error('Failed to fetch pharmacies')
        const data = await response.json()
        setPharmacies(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPharmacies()
  }, [])

  return { pharmacies, setPharmacies, loading, error }
}
