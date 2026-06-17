import { useEffect } from 'react'
import { pusherClient } from '@/lib/pusher'

export function useRealtimeStock(pharmacyId: string, onUpdate: (data: { medicineId: string, newQuantity: number }) => void) {
  useEffect(() => {
    if (!pharmacyId) return

    const channel = pusherClient.subscribe(`pharmacy-${pharmacyId}`)
    
    channel.bind('stock-update', (data: { medicineId: string, newQuantity: number }) => {
      console.log('Real-time stock update received:', data)
      onUpdate(data)
    })

    return () => {
      pusherClient.unsubscribe(`pharmacy-${pharmacyId}`)
    }
  }, [pharmacyId, onUpdate])
}
