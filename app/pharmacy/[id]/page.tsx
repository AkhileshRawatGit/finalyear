"use client"

import Link from "next/link"
import { ChevronLeft, MapPin, Phone, Clock, Star, Pill, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, use } from "react"
import { usePharmacies } from "@/hooks/use-pharmacies"
import { useMedicines } from "@/hooks/use-medicines"
import { useRealtimeStock } from "@/hooks/use-realtime-stock"
import type { PharmacyStore } from "@/lib/types"

export default function PharmacyDetailPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ medicine?: string }> }) {
  const params = use(paramsPromise)
  const searchParams = use(searchParamsPromise)

  const { pharmacies, loading: loadingPharmacies } = usePharmacies()
  const { medicines, loading: loadingMedicines } = useMedicines()

  const [pharmacy, setPharmacy] = useState<PharmacyStore | null>(null)

  useEffect(() => {
    const fetchPharmacy = async () => {
      // 1. Check if already in the list
      if (!loadingPharmacies && pharmacies.length > 0) {
        const found = pharmacies.find((p) => p.id === params.id)
        if (found) {
          setPharmacy(found)
          return
        }
      }

      // 2. If not found or still loading list, fetch individually
      try {
        const res = await fetch(`/api/pharmacy?id=${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setPharmacy(data)
        }
      } catch (err) {
        console.error("Individual fetch error:", err)
      }
    }

    fetchPharmacy()
  }, [pharmacies, loadingPharmacies, params.id])

  // Real-time stock updates listener
  useRealtimeStock(params.id, (data) => {
    setPharmacy((prev) => {
      if (!prev) return prev
      const newStock = prev.stock.map((s) =>
        s.medicineId === data.medicineId ? { ...s, quantity: data.newQuantity } : s
      )
      return { ...prev, stock: newStock }
    })
  })

  // Prevent accessing when still loading
  if (loadingPharmacies || loadingMedicines) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const selectedMedicine = medicines.find((m) => m.id === searchParams.medicine)

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Pharmacy not found</p>
          <Link href="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  const availableMedicines = pharmacy.stock.filter((stock) => stock.quantity > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/search" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Search
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{pharmacy.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-medium">{pharmacy.rating}</span>
                  <span className="text-sm text-muted-foreground">({pharmacy.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <Link href={`/user/checkout?pharmacy=${pharmacy.id}${searchParams.medicine ? `&medicine=${searchParams.medicine}` : ""}`}>
              <Button className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Place Order
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Store Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{pharmacy.location.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{pharmacy.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Operating Hours</p>
                    <p className="font-medium">
                      {pharmacy.openingTime} - {pharmacy.closingTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Pill className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Medicines in Stock</p>
                    <p className="font-medium">{availableMedicines.length} medicines</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Available Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableMedicines.map((stock) => {
                const medicine = medicines.find((m) => m.id === stock.medicineId)
                return (
                  <div
                    key={stock.medicineId}
                    className={`p-4 rounded-lg border transition-colors flex justify-between items-center ${selectedMedicine?.id === stock.medicineId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                      }`}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{medicine?.name}</h4>
                          <p className="text-sm text-muted-foreground">{medicine?.dosage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">₹{stock.price}</p>
                          <p className="text-xs text-muted-foreground">{stock.quantity} in stock</p>
                        </div>
                      </div>
                      <Link href={`/user/checkout?pharmacy=${pharmacy.id}&medicine=${stock.medicineId}&quantity=1`}>
                        <Button size="sm" className="w-full mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20">
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
