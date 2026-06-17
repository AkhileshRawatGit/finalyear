"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ExpiryAlertProps {
  medicines: Array<{
    name: string
    expiryDate: string
  }>
}

export function ExpiryAlert({ medicines }: ExpiryAlertProps) {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const expiringMedicines = medicines.filter((med) => {
    const expiryDate = new Date(med.expiryDate)
    return expiryDate <= thirtyDaysFromNow && expiryDate >= today
  })

  if (expiringMedicines.length === 0) {
    return null
  }

  return (
    <Card className="bg-destructive/5 border-destructive/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm text-destructive mb-2">Expiry Alert</p>
            <p className="text-xs text-muted-foreground mb-2">The following medicines are expiring within 30 days:</p>
            <ul className="space-y-1">
              {expiringMedicines.map((med) => (
                <li key={med.name} className="text-xs">
                  • {med.name} - Expires {med.expiryDate}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
