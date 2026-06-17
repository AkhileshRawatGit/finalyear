"use client"

import { MapPin, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PharmacyLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  distance: number
  price: number
}

interface MedicineMapProps {
  userLat: number
  userLon: number
  pharmacies: PharmacyLocation[]
  medicineId: string
}

export function MedicineMap({ userLat, userLon, pharmacies, medicineId }: MedicineMapProps) {
  // Calculate map bounds and render simplified map UI
  const mapHeight = 400

  if (pharmacies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No pharmacies within 5 KM radius</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className="bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/10 rounded-lg border border-border p-6 flex flex-col items-center justify-center"
          style={{ height: mapHeight }}
        >
          <MapPin className="w-8 h-8 text-primary mb-2" />
          <p className="text-foreground font-medium">Map Preview</p>
          <p className="text-xs text-muted-foreground mt-1">Google Maps Integration</p>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {pharmacies.slice(0, 3).map((pharmacy) => (
              <div key={pharmacy.id} className="text-xs bg-background/50 px-3 py-1 rounded">
                <p className="font-medium">{pharmacy.name}</p>
                <p className="text-muted-foreground">{pharmacy.distance.toFixed(1)} km</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
