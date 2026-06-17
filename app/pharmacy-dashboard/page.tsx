"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  AlertCircle,
  Package,
  Pill,
  BarChart3,
  ShoppingBag,
  Settings,
  Clock,
  Plus,
  Trash2,
  Truck,
  Minus,
  Save,
  X,
  Star,
  LogOut,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// Removed static medicines import for production
import { useMedicines } from "@/hooks/use-medicines"
import { pusherClient } from "@/lib/pusher"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/components/NotificationBell"
import { Logo } from "@/components/Logo"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
})

// These will be derived from state or more realistic placeholders
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

interface StockItem {
  id: string
  name: string
  type: string
  boxes: number
  stripsPerBox: number
  unitsPerStrip: number
  totalQuantity: number // Total individual units (e.g., total tablets)
  reorderLevel: number
  price: number
  expiryDate: string
}

export default function PharmacyDashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()

  const [pharmacy, setPharmacy] = useState<any>(null)
  const [stock, setStock] = useState<StockItem[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [allMedicines, setAllMedicines] = useState<any[]>([])
  const [showStockForm, setShowStockForm] = useState(false)
  const [dispenseIdState, setDispenseId] = useState<string | null>(null)
  const [dispenseQty, setDispenseQty] = useState(1)
  const [reviews, setReviews] = useState<any[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null)
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)

  // Form state
  const [newItem, setNewItem] = useState<StockItem>({
    id: "",
    name: "",
    type: "Tablet",
    boxes: 0,
    stripsPerBox: 10,
    unitsPerStrip: 10,
    totalQuantity: 0,
    reorderLevel: 500, // Adjusted for total units
    price: 0,
    expiryDate: "",
  })

  // Fetch pharmacy data and orders when authenticated
  useEffect(() => {
    // This check is now redundant due to the guard above, but kept for type safety within this effect
    if (!user) return

    if (user.userType !== "pharmacy" && user.userType !== "admin") {
      router.push("/")
      return
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch all medicines first for metadata lookup
        const medsRes = await fetch('/api/medicines')
        const medsData = await medsRes.json()
        setAllMedicines(medsData)

        // 1. Fetch Pharmacy Details
        const res = await fetch(`/api/pharmacy?ownerId=${user.id}`)
        if (!res.ok) throw new Error("Pharmacy not found")
        const pharmacyData = await res.json()
        setPharmacy(pharmacyData)
        setDeliveryEnabled(pharmacyData.deliveryAvailable)

        // Map live stock
        const mappedStock = pharmacyData.stock.map((s: any) => {
          const med = medsData.find((m: any) => m.id === s.medicineId || m._id === s.medicineId)
          return {
            id: s.medicineId,
            name: s.medicineName || (med ? med.name : "Unknown Medicine"),
            type: med ? med.category || med.type || "Tablet" : "Tablet",
            boxes: Math.floor(s.quantity / (s.unitsPerStrip || (med ? (med.unitsPerStrip || 10) : 10))),
            stripsPerBox: 10,
            unitsPerStrip: 10,
            totalQuantity: s.quantity,
            reorderLevel: s.reorderLevel || 50,
            price: s.price || (med ? med.price : 0),
            expiryDate: s.expiryDate || "2025-12-31",
          }
        })
        setStock(mappedStock)

        // 2. Fetch Orders
        const ordersRes = await fetch(`/api/orders?pharmacyId=${pharmacyData.id}`)
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          const formattedOrders = ordersData.map((o: any) => ({
            id: `ORD-${(o._id || o.id).substring((o._id || o.id).length - 4).toUpperCase()}`,
            dbId: o._id || o.id,
            customer: o.userId.substring(0, 8), // Rough mockup of user name
            medicines: o.medicines.length,
            total: o.totalPrice,
            status: o.status,
            time: new Date(o.createdAt).toLocaleString(),
            isNew: false
          }))
          setOrders(formattedOrders)
        }

        // 3. Fetch Reviews
        const reviewsRes = await fetch(`/api/reviews?pharmacyId=${pharmacyData.id}`)
        if (reviewsRes.ok) {
          setReviews(await reviewsRes.json())
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) fetchDashboardData()
  }, [user, authLoading])

  // Real-time listener for incoming orders
  useEffect(() => {
    if (!pharmacy?.id) return;

    const channel = pusherClient.subscribe(`admin-${pharmacy.id}`)

    channel.bind('new-order', (newOrder: any) => {
      console.log("New order received!", newOrder)
      // Format the incoming order for the dashboard UI
      const formatted = {
        id: `ORD-${(newOrder._id || newOrder.id).substring((newOrder._id || newOrder.id).length - 4).toUpperCase()}`,
        dbId: newOrder._id || newOrder.id,
        customer: "New Customer", // In a real app, join with user record
        medicines: newOrder.medicines.length,
        total: newOrder.totalPrice,
        status: "pending",
        time: "Just now",
        isNew: true
      }
      setOrders(prev => [formatted, ...prev])

      // Play a sound or show notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Order Received!", { body: `Order for ₹${newOrder.totalPrice}` })
      }
    })

    return () => {
      pusherClient.unsubscribe(`admin-${pharmacy.id}`)
    }
  }, [pharmacy?.id])

  // Auth guard and redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  if (!user) return null

  // (newItem was moved up)

  // Dispense state
  const dispenseId = dispenseIdState // dummy use to avoid lint error if not needed
  const lowStockMedicines = stock.filter((s) => s.totalQuantity <= (s.stripsPerBox * s.unitsPerStrip))
  const totalRevenue = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0)
  const totalOrders = orders.length
  const customerSatisfaction = 4.8

  // Basic analytics derived from stock and orders
  const salesData = orders.slice(0, 7).reverse().map((o: any) => ({
    date: o.time.split(',')[0],
    sales: o.total,
    orders: 1
  }))

  const medicineStockData = stock.slice(0, 5).map(s => ({
    name: s.name,
    stock: s.totalQuantity,
    reorder: s.reorderLevel
  }))

  const categoryDistribution = Object.entries(
    stock.reduce((acc: Record<string, number>, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const handleAddStock = async () => {
    if (newItem.name && newItem.boxes > 0) {
      // Calculate total quantity based on type
      let calculatedTotal = 0;
      if (["Tablet", "Capsule"].includes(newItem.type)) {
        calculatedTotal = newItem.boxes * newItem.stripsPerBox * newItem.unitsPerStrip
      } else {
        // For Syrups, Creams etc, we treat 'stripsPerBox' as 1 implicitly or ignored
        // So it is Boxes * UnitsPerBox (which is mapped to unitsPerStrip in UI)
        calculatedTotal = newItem.boxes * newItem.unitsPerStrip
      }

      const existingItemIndex = stock.findIndex(
        (s) => s.name.toLowerCase() === newItem.name.toLowerCase()
      )

      // Save to database
      try {
        const response = await fetch("/api/pharmacy/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pharmacyId: pharmacy.id,
            name: newItem.name,
            type: newItem.type,
            quantity: calculatedTotal,
            price: newItem.price,
            expiryDate: newItem.expiryDate
          })
        })
        if (!response.ok) throw new Error("Failed to save stock")

        if (existingItemIndex >= 0) {
          const current = stock[existingItemIndex]
          const newTotal = current.totalQuantity + calculatedTotal
          let packSize = 1;
          if (["Tablet", "Capsule"].includes(current.type)) {
            packSize = current.stripsPerBox * current.unitsPerStrip
          } else {
            packSize = current.unitsPerStrip
          }

          const updatedStock = [...stock]
          updatedStock[existingItemIndex] = {
            ...current,
            boxes: Math.floor(newTotal / packSize),
            totalQuantity: newTotal,
            type: newItem.type || current.type,
            price: newItem.price || current.price,
            expiryDate: newItem.expiryDate || current.expiryDate,
          }
          setStock(updatedStock)
        } else {
          setStock([
            ...stock,
            {
              ...newItem,
              id: Math.random().toString(36).substr(2, 9),
              totalQuantity: calculatedTotal
            },
          ])
        }

        setNewItem({
          id: "",
          name: "",
          type: "Tablet",
          boxes: 0,
          stripsPerBox: 10,
          unitsPerStrip: 10,
          totalQuantity: 0,
          reorderLevel: 500,
          price: 0,
          expiryDate: "",
        })
        setShowStockForm(false)
      } catch (err) {
        console.error("Stock save error:", err)
        alert("Error saving stock to database")
      }
    }
  }

  const handleDispense = async (id: string) => {
    const item = stock.find(s => s.id === id);
    if (!item) return;

    const newTotal = Math.max(0, item.totalQuantity - dispenseQty);
    
    // 1. Update local state
    setStock(
      stock.map((s) => {
        if (s.id === id) {
          const packSize = s.stripsPerBox * s.unitsPerStrip;
          return {
            ...s,
            totalQuantity: newTotal,
            boxes: Math.floor(newTotal / packSize)
          }
        }
        return s
      })
    )

    // 2. Sync with database
    try {
      const response = await fetch("/api/pharmacy/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyId: pharmacy.id,
          medicineId: id,
          name: item.name,
          quantity: -dispenseQty, // The API adds this to the current quantity
          price: item.price,
          expiryDate: item.expiryDate
        })
      })
      if (!response.ok) throw new Error("Failed to sync dispense to DB")
    } catch (err) {
      console.error("Dispense sync error:", err)
    }

    setDispenseId(null)
    setDispenseQty(1)
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const dbId = orderId.startsWith('ORD-') ? orders.find(o => o.id === orderId)?.dbId : orderId;
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: dbId || orderId, status: newStatus })
      })
      if (!response.ok) throw new Error("Failed to update status")

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    } catch (err) {
      console.error("Order status update error:", err)
      alert("Failed to update order status in database")
    }
  }

  const handleDeleteStock = (id: string) => {
    setStock(stock.filter((s) => s.id !== id))
  }

  const handleToggleDelivery = () => {
    setDeliveryEnabled(!deliveryEnabled)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showTagline={false} />
            <div className="h-8 w-px bg-border hidden sm:block" />
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Pharmacy Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell pharmacyId={pharmacy?.id} />
            <Button 
                variant={showSettings ? "default" : "ghost"} 
                size="icon" 
                className={showSettings ? "" : "text-muted-foreground hover:text-primary"}
                onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/') }} className="text-destructive font-medium border border-transparent hover:border-destructive/20 hover:bg-destructive/5 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoading || !pharmacy ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <Logo showTagline={false} />
                <div className="h-8 w-px bg-border hidden sm:block" />
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Pharmacy Dashboard</h1>
              </div>
              <p className="text-muted-foreground">Manage inventory, track sales, and optimize your pharmacy operations</p>
            </div>

            {showSettings && (
              <Card className="mb-8 border-primary animate-in fade-in slide-in-from-top-4 duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Store Location Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        Set your pharmacy's exact location by clicking on the map. This is essential for local search and delivery route calculations.
                      </p>
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="font-bold mb-1">Current Coordinates:</p>
                        <p className="font-mono text-xs">Lat: {tempLocation?.[0] || pharmacy.location.latitude}</p>
                        <p className="font-mono text-xs">Lng: {tempLocation?.[1] || pharmacy.location.longitude}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          disabled={!tempLocation || isUpdatingLocation}
                          onClick={async () => {
                            if (!tempLocation) return;
                            setIsUpdatingLocation(true);
                            try {
                              const res = await fetch("/api/pharmacy", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  pharmacyId: pharmacy.id,
                                  latitude: tempLocation[0],
                                  longitude: tempLocation[1]
                                })
                              });
                              if (res.ok) {
                                setPharmacy({
                                  ...pharmacy,
                                  location: { ...pharmacy.location, latitude: tempLocation[0], longitude: tempLocation[1] }
                                });
                                setTempLocation(null);
                                alert("Store location updated successfully!");
                              }
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsUpdatingLocation(false);
                            }
                          }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isUpdatingLocation ? "Updating..." : "Save Location"}
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setTempLocation(null)}>Reset</Button>
                      </div>
                    </div>
                    <div className="h-64 bg-slate-100 rounded-xl overflow-hidden border border-border">
                      <LeafletMap 
                        center={[pharmacy.location.latitude, pharmacy.location.longitude]} 
                        markers={tempLocation ? [{
                          id: "temp",
                          position: tempLocation,
                          title: "New Location",
                          content: "Proposed store location"
                        }] : [{
                          id: pharmacy.id,
                          position: [pharmacy.location.latitude, pharmacy.location.longitude],
                          title: pharmacy.name,
                          content: pharmacy.name
                        }]}
                        onMapClick={(lat, lng) => setTempLocation([lat, lng])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-2">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-xs text-muted-foreground mt-2">This month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-muted-foreground">Customer Rating</p>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{customerSatisfaction}</p>
                  <p className="text-xs text-muted-foreground mt-2">Out of 5.0</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-muted-foreground">Low Stock Alert</p>
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold">{lowStockMedicines.length}</p>
                  <p className="text-xs text-destructive mt-2">Need reorder</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Charts */}
              <div className="lg:col-span-2 space-y-8">
                {/* Sales Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Sales Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        sales: { label: "Sales (₹)", color: "hsl(var(--chart-1))" },
                        orders: { label: "Orders", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" />
                          <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Medicine Stock Levels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      Stock Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        stock: { label: "Current Stock", color: "hsl(var(--chart-1))" },
                        reorder: { label: "Reorder Level", color: "hsl(var(--chart-3))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={medicineStockData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="stock" fill="hsl(var(--chart-1))" />
                          <Bar dataKey="reorder" fill="hsl(var(--chart-3))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Medicine Category Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: { label: "Percentage", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orders.map((order: any, idx) => (
                        <div key={order.dbId || order.id || idx} className={`flex items-center justify-between p-3 rounded-lg border ${order.isNew ? 'bg-primary/5 border-primary animate-pulse' : 'bg-muted/30 border-transparent'}`}>
                          <div className="flex-1">
                            <p className="font-medium flex items-center gap-2">
                              {order.id}
                              {order.isNew && <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer} • {order.medicines} items • ₹{order.total} • {order.time}
                            </p>
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 rounded text-xs border border-border bg-background"
                            suppressHydrationWarning
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent orders</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      Customer Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No reviews yet</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((rev) => (
                          <div key={rev._id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= rev.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm italic text-foreground/80">"{rev.comment || "No comment"}"</p>
                            <p className="text-[10px] text-muted-foreground mt-2">— Order #{rev.orderId?.substring(rev.orderId.length - 4).toUpperCase()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Low Stock Alert */}
                {/* Alerts Section (Low Stock & Expiry) */}
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <span className="text-destructive">Action Required</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Expiry Alerts */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Expiry Alerts (Last 3 Days)
                      </h4>
                      {stock.filter(s => {
                        if (!s.expiryDate) return false;
                        const expDate = new Date(s.expiryDate);
                        const today = new Date();
                        const threeDaysFromNow = new Date();
                        threeDaysFromNow.setDate(today.getDate() + 3);
                        return expDate < threeDaysFromNow;
                      }).length === 0 ? (
                        <p className="text-xs text-muted-foreground italic pl-6">No immediate expiry threats.</p>
                      ) : (
                        stock.filter(s => {
                          if (!s.expiryDate) return false;
                          const expDate = new Date(s.expiryDate);
                          const today = new Date();
                          const threeDaysFromNow = new Date();
                          threeDaysFromNow.setDate(today.getDate() + 3);
                          return expDate < threeDaysFromNow;
                        }).map(s => {
                          const isExpired = new Date(s.expiryDate) < new Date();
                          return (
                            <div key={s.id} className={`p-2 rounded border text-sm flex items-center justify-between ${isExpired ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                              }`}>
                              <div>
                                <p className="font-medium text-gray-900">{s.name}</p>
                                <p className={`text-xs ${isExpired ? 'text-red-600 font-bold' : 'text-yellow-700'}`}>
                                  {isExpired ? "EXPIRED" : "Expiring Soon"}: {s.expiryDate}
                                </p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteStock(s.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )
                        })
                      )}
                    </div>

                    <div className="border-t border-border/50"></div>

                    {/* Low Stock Alerts */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Low Stock
                      </h4>
                      {lowStockMedicines.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic pl-6">All medicines well stocked</p>
                      ) : (
                        <div className="space-y-2">
                          {lowStockMedicines.map((stk: any) => (
                            <div
                              key={stk.id}
                              className="p-2 rounded bg-orange-50 border border-orange-100 text-sm flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{stk.name}</p>
                                <p className="text-xs text-orange-600">
                                  Only {stk.totalQuantity} units left
                                </p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-orange-600 hover:bg-orange-100" onClick={() => handleDeleteStock(stk.id)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-2" size="sm">
                      Place Reorder Order
                    </Button>
                  </CardContent>
                </Card>

                {/* Stock Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Stock</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!showStockForm ? (
                      <Button onClick={() => setShowStockForm(true)} className="w-full" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add/Update Stock
                      </Button>
                    ) : (
                      <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/20">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm">Add New Stock</h4>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowStockForm(false)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Medicine Name"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                            />
                            <select
                              value={newItem.type}
                              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                              className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                            >
                              <option value="Tablet">Tablet</option>
                              <option value="Syrup">Syrup</option>
                              <option value="Capsule">Capsule</option>
                              <option value="Injection">Injection</option>
                              <option value="Cream">Cream</option>
                              <option value="Drops">Drops</option>
                            </select>
                          </div>

                          {/* Dynamic Fields based on Medicine Type */}
                          {["Tablet", "Capsule"].includes(newItem.type) ? (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] text-muted-foreground">No. of Boxes</label>
                                <input
                                  type="number"
                                  placeholder="Boxes"
                                  value={newItem.boxes || ""}
                                  onChange={(e) => setNewItem({ ...newItem, boxes: Math.max(0, parseInt(e.target.value) || 0) })}
                                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">Strips/Box</label>
                                <input
                                  type="number"
                                  placeholder="Strips"
                                  value={newItem.stripsPerBox || ""}
                                  onChange={(e) => setNewItem({ ...newItem, stripsPerBox: Math.max(1, parseInt(e.target.value) || 1) })}
                                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">Tablets/Strip</label>
                                <input
                                  type="number"
                                  placeholder="Units"
                                  value={newItem.unitsPerStrip || ""}
                                  onChange={(e) => setNewItem({ ...newItem, unitsPerStrip: Math.max(1, parseInt(e.target.value) || 1) })}
                                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-muted-foreground">No. of Boxes</label>
                                <input
                                  type="number"
                                  placeholder="Boxes"
                                  value={newItem.boxes || ""}
                                  onChange={(e) => setNewItem({ ...newItem, boxes: Math.max(0, parseInt(e.target.value) || 0) })}
                                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground">Units/Box (Bottles/Tubes)</label>
                                <input
                                  type="number"
                                  placeholder="Units/Box"
                                  value={newItem.unitsPerStrip || ""} // Reusing unitsPerStrip as 'Units Per Box' for non-tablet types
                                  onChange={(e) => setNewItem({ ...newItem, unitsPerStrip: Math.max(1, parseInt(e.target.value) || 1) })}
                                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                                />
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-muted-foreground">Price per {["Tablet", "Capsule"].includes(newItem.type) ? "Strip" : "Unit"}</label>
                              <input
                                type="number"
                                placeholder="Price"
                                value={newItem.price || ""}
                                onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground">Reorder Level (Total Units)</label>
                              <input
                                type="number"
                                placeholder="Reorder Level"
                                value={newItem.reorderLevel || ""}
                                onChange={(e) => setNewItem({ ...newItem, reorderLevel: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-muted-foreground">Expiry Date</label>
                            <input
                              type="date"
                              value={newItem.expiryDate}
                              onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                              className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                            />
                          </div>
                        </div>

                        <Button onClick={handleAddStock} className="w-full mt-2" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save Stock
                        </Button>
                      </div>
                    )}

                    {/* Current Stock List */}
                    <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      <p className="text-xs font-semibold text-muted-foreground sticky top-0 bg-card py-1">Current Stock:</p>
                      {stock.map((stk) => {
                        const isExpired = new Date(stk.expiryDate) < new Date();
                        const isExpiringSoon = !isExpired && new Date(stk.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

                        return (
                          <div
                            key={stk.id}
                            className={`p-3 rounded-lg text-sm space-y-2 border ${isExpired ? "bg-red-50 border-red-200" : isExpiringSoon ? "bg-yellow-50 border-yellow-200" : "bg-muted/30 border-border/50"
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{stk.name}</p>
                                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600">{stk.type}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {["Tablet", "Capsule"].includes(stk.type) ? (
                                    <p>{stk.boxes} Boxes × {stk.stripsPerBox} Strips × {stk.unitsPerStrip} Units</p>
                                  ) : (
                                    <p>{stk.boxes} Boxes × {stk.unitsPerStrip} Units/Box</p>
                                  )}
                                  <p className="font-medium text-primary mt-0.5">Total: {stk.totalQuantity} units • ₹{stk.price}/{["Tablet", "Capsule"].includes(stk.type) ? "strip" : "unit"}</p>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                  <p className={`text-[10px] font-medium ${isExpired ? "text-red-600" : isExpiringSoon ? "text-yellow-600" : "text-muted-foreground"}`}>
                                    Exp: {stk.expiryDate}
                                    {isExpired ? " (EXPIRED)" : isExpiringSoon ? " (Expiring Soon)" : ""}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteStock(stk.id)}
                                className="text-destructive hover:bg-destructive/10 p-1 rounded"
                                suppressHydrationWarning
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Dispense Action */}
                            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                              {dispenseId === stk.id ? (
                                <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in duration-200">
                                  <input
                                    type="number"
                                    value={dispenseQty}
                                    onChange={(e) => setDispenseQty(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-16 px-2 py-1 text-xs border rounded bg-background"
                                    min="1"
                                    max={stk.totalQuantity}
                                  />
                                  <Button size="sm" className="h-7 px-2 text-xs" onClick={() => handleDispense(stk.id)}>
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => {
                                      setDispenseId(null)
                                      setDispenseQty(1)
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full h-7 text-xs bg-transparent"
                                  onClick={() => {
                                    setDispenseId(stk.id)
                                    setDispenseQty(1)
                                  }}
                                  disabled={stk.totalQuantity <= 0}
                                >
                                  <Minus className="w-3 h-3 mr-1" />
                                  Dispense Items
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


