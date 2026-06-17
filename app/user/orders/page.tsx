"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Package, MapPin, Phone, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useMedicines } from "@/hooks/use-medicines"
import { usePharmacies } from "@/hooks/use-pharmacies"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/Logo"
import { NotificationBell } from "@/components/NotificationBell"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">Loading Map...</div>
})

export default function OrdersPage() {
  const { user: currentUser, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const { medicines, loading: loadingMedicines } = useMedicines()
  const { pharmacies: pharmacyStores, loading: loadingPharmacies } = usePharmacies()
  const [trackingOrder, setTrackingOrder] = useState<any>(null)
  const [deliveryPos, setDeliveryPos] = useState<[number, number] | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/orders?userId=${currentUser.id}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
      } finally {
        setLoadingOrders(false)
      }
    }
    if (currentUser) {
      fetchOrders()
    } else if (!authLoading) {
      setLoadingOrders(false)
    }
  }, [currentUser, authLoading])

  // Simulation effect for delivery movement
  useEffect(() => {
    if (!trackingOrder || !currentUser?.location) return

    const pharmacy = pharmacyStores.find(p => p.id === trackingOrder.pharmacyId)
    if (!pharmacy) return

    const start = [pharmacy.location.latitude, pharmacy.location.longitude]
    const end = [currentUser.location.latitude, currentUser.location.longitude]

    // Determine progress based on status
    let initialProgress = 0
    if (trackingOrder.status === 'preparing') initialProgress = 10
    if (trackingOrder.status === 'out_for_delivery') initialProgress = 40
    if (trackingOrder.status === 'delivered') initialProgress = 100

    setProgress(initialProgress)

    if (trackingOrder.status === 'out_for_delivery') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 0.5
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [trackingOrder, pharmacyStores, currentUser])

  useEffect(() => {
    if (!trackingOrder || !currentUser?.location) return
    const pharmacy = pharmacyStores.find(p => p.id === trackingOrder.pharmacyId)
    if (!pharmacy) return

    const start = [pharmacy.location.latitude, pharmacy.location.longitude] as [number, number]
    const end = [currentUser.location.latitude, currentUser.location.longitude] as [number, number]

    // Simple linear interpolation for simulation
    const lat = start[0] + (end[0] - start[0]) * (progress / 100)
    const lng = start[1] + (end[1] - start[1]) * (progress / 100)
    setDeliveryPos([lat, lng])
  }, [progress, trackingOrder, currentUser, pharmacyStores])

  const isLoading = loadingOrders || loadingMedicines || loadingPharmacies || authLoading;

  if (!authLoading && !currentUser) {
    return <div className="p-8 text-center">Please login to view orders.</div>
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link href="/user/dashboard">
              <Button variant="ghost" size="sm" className="font-medium">Dashboard</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/') }} className="text-destructive font-medium border border-transparent hover:border-destructive/20 hover:bg-destructive/5 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link href="/search">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const pharmacy = pharmacyStores.find((p) => p.id === order.pharmacyId)
              const displayId = order._id?.substring((order._id || "").length - 4).toUpperCase() || order.id
              return (
                <Card key={order._id || order.id || idx}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{displayId}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{order.totalPrice}</p>
                        <div
                          className={`text-xs font-medium mt-2 px-3 py-1 rounded-full w-fit ${order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-primary/10 text-primary"
                            }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <p className="font-medium text-sm mb-3">Items</p>
                      <div className="space-y-2">
                        {order.medicines.map((item: any) => {
                          const medicine = medicines.find((m) => m.id === item.medicineId)
                          return (
                            <div
                              key={item.medicineId}
                              className="p-2 rounded flex justify-between text-sm border border-border"
                            >
                              <span>{medicine?.name}</span>
                              <span className="font-medium">x{item.quantity}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Pharmacy Info */}
                    {pharmacy && (
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <p className="font-medium text-sm">{pharmacy.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {pharmacy.location.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {pharmacy.phone}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setTrackingOrder(order)}
                        >
                          Track Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      <Dialog open={!!trackingOrder} onOpenChange={(open) => !open && setTrackingOrder(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Track Order #{trackingOrder?.id}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x overflow-hidden">
            {/* Map Section */}
            <div className="flex-1 bg-muted relative min-h-[300px]">
              {trackingOrder && currentUser?.location && (
                <LeafletMap
                  center={deliveryPos || [currentUser.location.latitude, currentUser.location.longitude]}
                  userLocation={[currentUser.location.latitude, currentUser.location.longitude]}
                  deliveryLocation={deliveryPos || undefined}
                  markers={[]}
                  navigationTarget={deliveryPos || undefined}
                />
              )}
            </div>

            {/* Status Section */}
            <div className="w-full md:w-72 p-6 overflow-y-auto bg-card">
              <h3 className="font-bold mb-6">Delivery Status</h3>

              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

                {[
                  { key: 'pending', label: 'Order Placed', desc: 'Pharmacy has received your order' },
                  { key: 'preparing', label: 'Preparing', desc: 'Your medicines are being packed' },
                  { key: 'out_for_delivery', label: 'On the Way', desc: 'Delivery partner is heading to you' },
                  { key: 'delivered', label: 'Delivered', desc: 'Order completed' },
                ].map((s, idx) => {
                  const statuses = ['pending', 'preparing', 'out_for_delivery', 'delivered']
                  const currentIdx = statuses.indexOf(trackingOrder?.status || 'pending')
                  const isDone = idx <= currentIdx
                  const isCurrent = idx === currentIdx

                  return (
                    <div key={s.key} className="relative pl-8 flex flex-col gap-1">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-background z-10 flex items-center justify-center transition-colors ${isDone ? 'bg-primary' : 'bg-muted'
                        }`}>
                        {isDone && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <p className={`text-sm font-bold ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.label}
                        {isCurrent && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-12 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">Estimated Arrival</p>
                <p className="text-lg font-bold">15-20 Mins</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
