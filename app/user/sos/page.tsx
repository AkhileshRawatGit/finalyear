"use client"
import { AlertCircle, MapPin, Phone, Navigation, Pill, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { calculateDistance } from "@/lib/data"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"

export default function SOSPage() {
  const { user: currentUser } = useAuth()
  const [nearestPharmacies, setNearestPharmacies] = useState<any[]>([])
  
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
         const res = await fetch("/api/pharmacy")
         if (res.ok) {
            const pharmacies = await res.json()
            if (currentUser?.location) {
               const sorted = pharmacies.map((pharmacy: any) => ({
                 ...pharmacy,
                 distance: calculateDistance(
                   currentUser.location!.latitude,
                   currentUser.location!.longitude,
                   pharmacy.location.latitude,
                   pharmacy.location.longitude,
                 ),
               })).sort((a: any, b: any) => a.distance - b.distance).slice(0, 3)
               setNearestPharmacies(sorted)
            } else {
               setNearestPharmacies(pharmacies.slice(0, 3).map((p: any) => ({...p, distance: 0})))
            }
         }
      } catch (err) {
         console.error("SOS fetch error:", err)
      }
    }
    fetchPharmacies()
  }, [currentUser])

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Header */}
      <div className="bg-destructive text-destructive-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-75" />
          <h1 className="text-3xl font-bold mb-2">Emergency SOS Mode</h1>
          <p className="opacity-90">Get immediate help in critical situations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Emergency Call Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6 text-center space-y-4">
              <Phone className="w-8 h-8 text-destructive mx-auto" />
              <h3 className="font-semibold">Emergency Services</h3>
              <p className="text-sm text-muted-foreground">Call immediate medical help</p>
              <Button className="w-full bg-destructive hover:bg-destructive/90">Call Ambulance (+91-108)</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6 text-center space-y-4">
              <Users className="w-8 h-8 text-destructive mx-auto" />
              <h3 className="font-semibold">Emergency Doctor</h3>
              <p className="text-sm text-muted-foreground">Connect with nearest doctor</p>
              <Button className="w-full bg-destructive hover:bg-destructive/90">Find Doctor Now</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6 text-center space-y-4">
              <Pill className="w-8 h-8 text-destructive mx-auto" />
              <h3 className="font-semibold">Nearest Pharmacy</h3>
              <p className="text-sm text-muted-foreground">Find emergency medicines</p>
              <Button className="w-full bg-destructive hover:bg-destructive/90">Open 24/7 Pharmacies</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Nearest Pharmacies */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Nearest Pharmacies
            </h2>
            <div className="space-y-3">
              {nearestPharmacies.map((pharmacy) => (
                <Card key={pharmacy.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{pharmacy.name}</h3>
                      <span className="text-sm font-bold text-primary">{pharmacy.distance.toFixed(1)} km</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {pharmacy.location.address}
                    </p>
                    <p
                      className={`text-xs font-medium mb-3 ${pharmacy.deliveryAvailable ? "text-green-600" : "text-destructive"}`}
                    >
                      {pharmacy.deliveryAvailable ? "✓ Delivery Available" : "Pickup Only"}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 gap-2">
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                        <Navigation className="w-3 h-3" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Nearby Doctors */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Available Doctors (Mock API)
            </h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground p-8">
                   No doctors available in your area currently.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Emergency Info */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Emergency Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium mb-2">Important Emergency Numbers</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Emergency: 112</li>
                  <li>Ambulance: 108</li>
                  <li>Police: 100</li>
                  <li>Medical Poison Control: 1800-226-250</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Emergency Medicine Info</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Always carry your medical records</li>
                  <li>Know your allergies</li>
                  <li>Have emergency contact info ready</li>
                  <li>Update your prescription status</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
