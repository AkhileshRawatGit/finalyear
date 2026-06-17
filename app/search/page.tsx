"use client"
import { useState, useMemo, useEffect, Suspense } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Star, ChevronRight, AlertCircle, X, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NotificationBell } from "@/components/NotificationBell"
import { Logo } from "@/components/Logo"
import { calculateDistance } from "@/lib/data"
import { useAuth } from "@/contexts/AuthContext"
import { useMedicines } from "@/hooks/use-medicines"
import { usePharmacies } from "@/hooks/use-pharmacies"
import type { Medicine } from "@/lib/types"

// Dynamically import the map component to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/20">
      <p className="text-muted-foreground">Loading Map...</p>
    </div>
  ),
})

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const { user: currentUser } = useAuth()
  const [browserLocation, setBrowserLocation] = useState<[number, number] | undefined>(undefined)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setBrowserLocation([position.coords.latitude, position.coords.longitude])
      })
    }
  }, [])

  const userCoords = useMemo(() => {
    if (currentUser?.location) return [currentUser.location.latitude, currentUser.location.longitude] as [number, number]
    return browserLocation
  }, [currentUser, browserLocation])

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [radius] = useState(10)
  const [viewMode, setViewMode] = useState<"list" | "map">("map")
  const [navigationTarget, setNavigationTarget] = useState<[number, number] | undefined>(undefined)
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | undefined>(undefined)

  const handleFetchRoute = async (target: [number, number]) => {
    if (!userCoords) return;
    setNavigationTarget(target) // Set target immediately for centering
    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${userCoords[1]},${userCoords[0]};${target[1]},${target[0]}?overview=full&geometries=geojson`)
      const data = await resp.json()
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]])
        setRouteCoordinates(coords)
      } else {
        setRouteCoordinates(undefined) // Fallback to straight line
      }
    } catch (err) {
      console.error("Route fetch error:", err)
      setRouteCoordinates(undefined) // Fallback to straight line
    }
  }

  // Fetch live data
  const { medicines, loading: loadingMedicines } = useMedicines()
  const { pharmacies: pharmacyStores, loading: loadingPharmacies } = usePharmacies()


  // Filter medicines based on search
  const filteredMedicines = useMemo(() => {
    return medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  // Automatically select the first medicine if searching from homepage
  useEffect(() => {
    if (initialQuery && filteredMedicines.length > 0 && !selectedMedicine) {
      setSelectedMedicine(filteredMedicines[0])
    }
  }, [initialQuery, filteredMedicines, selectedMedicine])

  // Get pharmacies with selected medicine in stock, sorted by distance
  const pharmaciesWithMedicine = useMemo(() => {
    if (!selectedMedicine) return []

    const pharmaciesWithStock = pharmacyStores
      .filter((pharmacy) =>
        pharmacy.stock.some((stock) => stock.medicineId === selectedMedicine.id && stock.quantity > 0),
      )
      .map((pharmacy) => {
        const distance = userCoords ? calculateDistance(
          userCoords[0],
          userCoords[1],
          pharmacy.location.latitude,
          pharmacy.location.longitude,
        ) : 999
        const medicineStock = pharmacy.stock.find((s) => s.medicineId === selectedMedicine.id)
        return {
          ...pharmacy,
          distance,
          price: medicineStock?.price || 0,
        }
      })
      .filter((pharmacy) => {
        if (!userCoords) return true
        const deliveryRadius = pharmacy.deliveryRadius || 10
        return pharmacy.distance <= deliveryRadius
      })
      .sort((a, b) => a.distance - b.distance)

    return pharmaciesWithStock
  }, [selectedMedicine, radius])

  const mapMarkers = useMemo(() => {
    return pharmaciesWithMedicine.map((pharmacy) => ({
      id: pharmacy.id,
      position: [pharmacy.location.latitude, pharmacy.location.longitude] as [number, number],
      title: pharmacy.name,
      content: (
        <div className="min-w-[200px] p-1">
          <h4 className="font-bold text-sm mb-1">{pharmacy.name}</h4>
          <p className="text-xs text-muted-foreground mb-2">{pharmacy.location.address}</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
              In Stock
            </span>
            <span className="font-bold text-primary">₹{pharmacy.price}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/pharmacy/${pharmacy.id}?medicine=${selectedMedicine?.id}`} className="flex-1">
              <Button size="sm" className="w-full h-7 text-xs">View Details</Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className={`h-7 w-7 p-0 ${navigationTarget?.[0] === pharmacy.location.latitude ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleFetchRoute([pharmacy.location.latitude, pharmacy.location.longitude]);
              }}
            >
              <Navigation className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ),
    }))
  }, [pharmaciesWithMedicine, selectedMedicine, navigationTarget])

  // Center map on results or user location
  const mapCenter = useMemo(() => {
    if (pharmaciesWithMedicine.length > 0) {
      return [pharmaciesWithMedicine[0].location.latitude, pharmaciesWithMedicine[0].location.longitude] as [number, number]
    }
    if (userCoords) {
      return userCoords
    }
    return [28.6139, 77.2090] as [number, number]
  }, [pharmaciesWithMedicine, userCoords])

  // Automatic scroll to map on mobile/small screens when medicine selected
  useEffect(() => {
    if (selectedMedicine && window.innerWidth < 1024) {
      const mapElement = document.getElementById("search-results-map")
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [selectedMedicine])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && <NotificationBell />}
            <Link href="/">
              <Button variant="ghost" size="sm" className="font-medium">Home</Button>
            </Link>
            {currentUser && (
              <Link href="/user/dashboard">
                <Button variant="ghost" size="sm" className="font-medium">Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Medicines Near You</h1>
          <p className="text-muted-foreground">Search medicines and see available pharmacies within your delivery range</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-250px)] min-h-[600px]">
          {/* Left Column - Medicine Search */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardContent className="pt-6 flex-1 flex flex-col overflow-hidden">
                {/* Search Input */}
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="relative flex-shrink-0">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search medicines..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Medicine List */}
                  <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                    {loadingMedicines ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredMedicines.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8 text-sm">No medicines found</p>
                    ) : (
                      filteredMedicines.map((medicine) => (
                        <button
                          key={medicine.id}
                          onClick={() => setSelectedMedicine(medicine)}
                          className={`w-full p-3 rounded-lg text-left transition-colors border ${selectedMedicine?.id === medicine.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                            }`}
                        >
                          <div className="font-medium text-sm">{medicine.name}</div>
                          <div className="text-xs text-muted-foreground">{medicine.genericName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{medicine.dosage}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map and Details */}
          <div className="lg:col-span-2 h-full flex flex-col">
            {!selectedMedicine ? (
              <Card className="h-full flex items-center justify-center bg-muted/10">
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-30" />
                  <h3 className="text-xl font-semibold mb-2">Select a Medicine</h3>
                  <p className="text-muted-foreground">
                    Choose a medicine from the list to view available pharmacies on the map
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex flex-col gap-4">
                {/* Medicine Details Header */}
                <Card className="flex-shrink-0">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          {selectedMedicine.name}
                          <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {selectedMedicine.dosage}
                          </span>
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">{selectedMedicine.genericName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">
                          {pharmaciesWithMedicine.length} Pharmacies Nearby
                        </p>
                        <button
                          onClick={() => setSelectedMedicine(null)}
                          className="text-xs text-muted-foreground hover:text-foreground mt-1 underline"
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map View */}
                <Card id="search-results-map" className="flex-1 overflow-hidden border-2 border-primary/10 relative">
                  {loadingPharmacies ? (
                    <div className="absolute inset-0 z-[1000] bg-background/80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 z-0">
                        <LeafletMap
                          center={mapCenter}
                          markers={mapMarkers}
                          userLocation={userCoords}
                          navigationTarget={navigationTarget}
                          routeCoordinates={routeCoordinates}
                        />
                      </div>

                      {/* Overlay for "No Results" */}
                      {pharmaciesWithMedicine.length === 0 && (
                        <div className="absolute inset-0 z-[1000] bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center max-w-md p-6">
                            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">No Pharmacies Found Nearby</h3>
                            <p className="text-muted-foreground mb-4">
                              We couldn't find this medicine within {radius}km.
                            </p>
                            {selectedMedicine.substitutes.length > 0 && (
                              <div className="bg-card border border-border p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Try searching for substitutes:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {selectedMedicine.substitutes.map(sub => (
                                    <span key={sub} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <SearchContent />
    </Suspense>
  )
}
