"use client"

import { Star, MapPin, Phone, Calendar, BadgeCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctors")
        const data = await res.json()
        if (Array.isArray(data)) {
          setDoctors(data)
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const specializations = ["all", ...new Set(doctors.map(d => d.specialization))].filter(Boolean)

  const filteredDoctors =
    selectedSpecialization === "all" ? doctors : doctors.filter((d) => d.specialization === selectedSpecialization)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-lg">MedAccess - Doctor Network</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Connected Doctors</h1>
          <p className="text-muted-foreground">Book consultations and get medical advice from verified doctors</p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex gap-2 flex-wrap justify-center md:justify-start">
          {specializations.map((spec: any) => (
            <Button
              key={spec}
              variant={selectedSpecialization === spec ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialization(spec)}
              className={selectedSpecialization === spec ? "" : "bg-transparent"}
            >
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </Button>
          ))}
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching verified doctors...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id || doctor._id?.toString()} className="hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{doctor.doctorName}</h3>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    </div>
                    <BadgeCheck className="w-5 h-5 text-primary" />
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {doctor.pharmacy}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {doctor.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />₹{doctor.consultationFee} consultation fee
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium text-sm">{doctor.rating || 5}</span>
                    <span className="text-xs text-muted-foreground">({doctor.reviews || 0} reviews)</span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Book Now
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No doctors found for this specialization.</p>
          </div>
        )}
      </div>
    </div>
  )
}
