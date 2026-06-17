"use client"

import Link from "next/link"
import { MapPin, Pill, Heart, Clock, AlertCircle, ShoppingBag, Plus, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { pusherClient } from "@/lib/pusher"
import { NotificationBell } from "@/components/NotificationBell"
import { Logo } from "@/components/Logo"

export default function UserDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [activeReminders, setActiveReminders] = useState<any[]>([])
  const [userDigitalRecords, setUserDigitalRecords] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [ordersRes, remindersRes, recordsRes] = await Promise.all([
          fetch(`/api/orders?userId=${user.id}`),
          fetch(`/api/reminders?userId=${user.id}`),
          fetch(`/api/records?userId=${user.id}`)
        ]);

        if (ordersRes.ok) {
          const orders = await ordersRes.json()
          setRecentOrders(orders.slice(0, 3).map((o: any) => ({
            ...o,
            createdAt: new Date(o.createdAt).toLocaleString()
          })))
        }

        if (remindersRes.ok) {
          const reminders = await remindersRes.json()
          setActiveReminders(reminders.filter((r: any) => r.enabled))
        }

        if (recordsRes.ok) {
          setUserDigitalRecords(await recordsRes.json())
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setDataLoading(false)
      }
    };

    fetchDashboardData()
  }, [user]);

  // Real-time listener for order updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = pusherClient.subscribe(`user-${user.id}`)

    channel.bind('order-status-update', (data: any) => {
      console.log("Order status update received!", data)
      // Update local orders state
      setRecentOrders(prev => prev.map(o => {
        if (o.id === data.orderId || o._id === data.orderId) {
          return { ...o, status: data.status, updatedAt: new Date().toISOString() }
        }
        return o
      }))

      // Optionally show a browser notification or toast
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Order Update", { body: data.message })
      }
    })

    return () => {
      pusherClient.unsubscribe(`user-${user.id}`)
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || (user && dataLoading)) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link href="/search">
              <Button variant="ghost" size="sm" className="font-medium">
                Search Medicines
              </Button>
            </Link>
            <Link href="/user/profile">
              <Button variant="ghost" size="sm" className="font-medium">
                Profile
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/') }} className="text-destructive font-medium border border-transparent hover:border-destructive/20 hover:bg-destructive/5 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your medicines, track orders, and stay healthy</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/search">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <p className="font-medium">Find Medicines</p>
                <p className="text-xs text-muted-foreground mt-1">Search nearby pharmacies</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/orders">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <ShoppingBag className="w-8 h-8 text-primary mb-3" />
                <p className="font-medium">My Orders</p>
                <p className="text-xs text-muted-foreground mt-1">View your order history</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/sos">
            <Card className="hover:border-destructive transition-colors cursor-pointer border-destructive/20">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <AlertCircle className="w-8 h-8 text-destructive mb-3" />
                <p className="font-medium">SOS Mode</p>
                <p className="text-xs text-muted-foreground mt-1">Emergency help</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Medicine Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Active Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeReminders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No active reminders. Set one up to stay on track!</p>
                ) : (
                  <div className="space-y-3">
                    {activeReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="p-3 rounded-lg border border-border flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-sm">{reminder.medicineName}</p>
                          <p className="text-xs text-muted-foreground">
                            {reminder.frequency} • Next: {reminder.nextDue}
                          </p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Active</div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/user/reminders" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Manage Reminders
                  </Button>
                </Link>
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
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No orders yet. Start searching for medicines!</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order, idx) => (
                      <div key={order._id || order.id || idx} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">Order #{order._id?.substring((order._id || "").length - 4).toUpperCase() || order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₹{order.totalPrice}</p>
                            <p
                              className={`text-xs font-medium ${order.status === "delivered"
                                ? "text-green-600"
                                : order.status === "cancelled"
                                  ? "text-destructive"
                                  : "text-accent"
                                }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.medicines.length} item{order.medicines.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/user/orders" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Digital Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Medical Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userDigitalRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-2 rounded text-sm hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-xs capitalize">{record.recordType.replace("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">{record.title}</p>
                    </div>
                  ))}
                </div>
                <Link href="/user/records" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add Record
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Take medicines at the same time daily
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Check expiry dates regularly
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Keep prescriptions handy
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    Follow doctor's instructions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
