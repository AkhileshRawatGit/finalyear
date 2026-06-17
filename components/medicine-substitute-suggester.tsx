"use client"

import { Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { medicines } from "@/lib/data"

interface MedicineSubstituteSuggesterProps {
  medicineId: string
}

export function MedicineSubstituteSuggester({ medicineId }: MedicineSubstituteSuggesterProps) {
  const medicine = medicines.find((m) => m.id === medicineId)

  if (!medicine || medicine.substitutes.length === 0) {
    return null
  }

  const substitutes = medicines.filter((m) => medicine.substitutes.includes(m.name))

  return (
    <Card className="bg-accent/5 border-accent/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm mb-2">Alternative Medicines Available</p>
            <p className="text-xs text-muted-foreground mb-3">
              These medicines have similar effects and may be available if {medicine.name} is out of stock:
            </p>
            <div className="space-y-1">
              {substitutes.map((sub) => (
                <p key={sub.id} className="text-xs">
                  • <span className="font-medium">{sub.name}</span> - {sub.dosage}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
